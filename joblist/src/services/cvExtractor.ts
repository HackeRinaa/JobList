"use client";

// CV extraction service that handles PDF parsing

// Define interfaces for better type safety
interface ExtractedData {
  extractedText: string;
  summary: string | null;
}

// Function to extract text from a PDF file
export async function extractCVData(file: File): Promise<ExtractedData> {
  try {
    // Dynamic import of pdfjs to avoid server-side window reference issues
    const pdfjsLib = await import('pdfjs-dist');
    const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
    
    // Set the worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default as string;
    
    // Read the file as an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Load the PDF
    const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      // Concatenate the text from each item
      const pageText = textContent.items
        .map(item => 'str' in item ? item.str : '')
        .join(' ');
      
      fullText += pageText + '\n';
    }
    
    // Generate a summary (optional - could be done via API call to OpenAI)
    const summary = null;
    
    return {
      extractedText: fullText,
      summary
    };
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return {
      extractedText: '',
      summary: null
    };
  }
}

// Function to summarize CV text using OpenAI API
export async function summarizeCVText(text: string): Promise<string> {
  try {
    // For demo, we're returning a simplified version
    // In production, you would call an API endpoint that uses OpenAI
    // to generate a proper summary
    
    // Example of API call (commented out):
    /*
    const response = await fetch('/api/summarize-cv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    
    const data = await response.json();
    return data.summary;
    */
    
    // For now, return a placeholder summary based on the text length
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length > 500) {
      return `Έμπειρος επαγγελματίας με εκτενή γνώση στον τομέα του. Έχει εργαστεί σε πολλαπλά έργα και κατέχει σημαντικές δεξιότητες.`;
    } else if (words.length > 200) {
      return `Επαγγελματίας με εμπειρία στον κλάδο και καλές τεχνικές δεξιότητες.`;
    } else {
      return `Επαγγελματίας με βασικές γνώσεις και δεξιότητες στον τομέα του.`;
    }
  } catch (error) {
    console.error('Error summarizing CV text:', error);
    return '';
  }
} 