import { GoogleGenAI, Type } from "@google/genai";
import { ParseResult, BankType, Transaction } from "../types";

const SYSTEM_INSTRUCTION = `
You are a specialized financial data extraction assistant. Your task is to extract bank transaction data from uploaded bank statement documents (PDF or Image).
The supported banks are: Banco Popular de Puerto Rico, FirstBank Puerto Rico, and Oriental Bank.

Analyze the document and extract the following:
1. Identify the Bank Name (Popular, FirstBank, or Oriental).
2. Extract all transactions into a structured list.

For each transaction, extract:
- Date: Format YYYY-MM-DD. If the year is not explicitly on the row, infer it from the statement period header. If ambiguous, use the current year.
- Description: Extract ONLY the vendor name, payee, or payer. REMOVE all non-essential text such as:
    - Transaction codes (e.g., POS, ACH, DEBIT, W/D, CHECK)
    - Dates within the description
    - Store numbers, IDs, or reference codes (e.g., #1234, ID:54321, 555-555-5555)
    - Location codes (e.g., SJU, NY, PR) unless part of the brand name
    Example: "DEBIT CARD PURCHASE WALMART #2342 SAN JUAN PR" -> "Walmart"
    Example: "ATH MOVIL TRANSFER TO 787xxx" -> "ATH Movil Transfer"
- Amount: The absolute numerical value of the transaction.
- Type: 'DEBIT' for withdrawals, payments, fees, checks. 'CREDIT' for deposits, interest, refunds.
- Reference: Any check number or reference ID associated with the line item. Null if not found.

Rules:
- Ignore headers, footers, page numbers, and summary balances.
- Only extract the line-item transactions.
- Handle multi-line descriptions by combining them before cleaning.
- If there are multiple sections (e.g., "Electronic Withdrawals", "Checks Paid"), combine them all into one list.
`;

export const parseBankStatement = async (base64Data: string, mimeType: string): Promise<ParseResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is available.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: "Extract all bank transactions from this document. Return the data in JSON format."
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bankName: {
              type: Type.STRING,
              enum: ["Banco Popular", "FirstBank", "Oriental Bank", "Unknown Bank"],
              description: "The name of the bank identified in the statement."
            },
            transactions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING, description: "Transaction date in YYYY-MM-DD" },
                  description: { type: Type.STRING, description: "Cleaned vendor/payee name only" },
                  amount: { type: Type.NUMBER, description: "Absolute amount of the transaction" },
                  type: { type: Type.STRING, enum: ["DEBIT", "CREDIT"], description: "Type of transaction" },
                  reference: { type: Type.STRING, description: "Check number or reference code", nullable: true }
                },
                required: ["date", "description", "amount", "type"]
              }
            }
          },
          required: ["bankName", "transactions"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No data returned from Gemini.");
    }

    const data = JSON.parse(jsonText);
    
    // map string bank name to Enum
    let bankEnum = BankType.UNKNOWN;
    if (data.bankName.includes("Popular")) bankEnum = BankType.POPULAR;
    else if (data.bankName.includes("FirstBank")) bankEnum = BankType.FIRSTBANK;
    else if (data.bankName.includes("Oriental")) bankEnum = BankType.ORIENTAL;

    return {
      bank: bankEnum,
      transactions: data.transactions as Transaction[],
      rawText: JSON.stringify(data, null, 2)
    };

  } catch (error) {
    console.error("Gemini Parsing Error:", error);
    throw new Error("Failed to process the document. Please try again or check the file quality.");
  }
};
