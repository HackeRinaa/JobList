// Deno types
declare namespace Deno {
  export interface Env {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
    toObject(): { [key: string]: string };
  }
  export const env: Env;
}

// External module declarations
declare module 'https://deno.land/std@0.177.0/http/server.ts' {
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
}

declare module 'https://esm.sh/@supabase/supabase-js@2.21.0' {
  export function createClient(supabaseUrl: string, supabaseKey: string, options?: any): any;
}

declare module 'https://esm.sh/twilio@4.8.0' {
  export class Twilio {
    constructor(accountSid: string, authToken: string);
    messages: {
      create(params: { body: string; from: string; to: string }): Promise<any>;
    };
  }
} 