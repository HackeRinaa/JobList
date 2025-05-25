import { OpenAI } from 'openai';
import type { TextItem } from 'pdfjs-dist';

// Initialize OpenAI client - you should use environment variables in production
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for client-side use
});

interface CVData {
  extractedText: string;
  summary?: string;
  skills?: string[];
  experience?: string;
}

// Client-side PDF text extraction using PDF.js
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    // Use dynamic import to avoid server-side issues
    const pdfjs = await import('pdfjs-dist');
    
    // Set worker source path - using CDN path directly
    pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.6.172/pdf.worker.min.js';
    
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          if (!event.target?.result) throw new Error('Failed to read file');
          
          const typedArray = new Uint8Array(event.target.result as ArrayBuffer);
          const pdf = await pdfjs.getDocument({ data: typedArray }).promise;
          
          let text = '';
          const numPages = pdf.numPages;
          
          for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map((item: TextItem) => 
              item.str || ''
            ).join(' ');
            text += strings + '\n';
          }
          
          resolve(text);
        } catch (error) {
          console.error("PDF extraction error:", error);
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  } catch (error) {
    console.error("PDF library load error:", error);
    return "Failed to load PDF extraction library";
  }
}

export async function extractCVData(file: File): Promise<CVData> {
  try {
    // Extract raw text from PDF
    const extractedText = await extractTextFromPDF(file);
    
    // Use OpenAI to analyze the CV
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI specialized in analyzing CVs and resumes. Extract key information in Greek."
        },
        {
          role: "user",
          content: `Analyze this CV and extract a 2-3 sentence summary, list of skills, and brief description of experience. 
                   Format the response as JSON with keys: summary, skills (as array), experience.
                   Here's the CV text: ${extractedText.substring(0, 4000)}` // Truncate to avoid token limits
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const analysisResult = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      extractedText,
      summary: analysisResult.summary,
      skills: analysisResult.skills,
      experience: analysisResult.experience
    };
  } catch (error) {
    console.error("Error analyzing CV:", error);
    return { extractedText: "Failed to extract CV data" };
  }
}

export async function summarizeCVText(text: string): Promise<string> {
  try {
    // Use AI to generate a summary of the CV
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI specialized in writing professional biographies in Greek."
        },
        {
          role: "user",
          content: `Create a professional bio from this CV text. Keep it concise (3-4 sentences) and 
                   highlight key qualifications and experience. Write in Greek, first person.
                   CV text: ${text.substring(0, 4000)}` // Truncate to avoid token limits
        }
      ]
    });
    
    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error summarizing CV text:", error);
    return "Σφάλμα κατά την επεξεργασία του κειμένου του βιογραφικού.";
  }
} 