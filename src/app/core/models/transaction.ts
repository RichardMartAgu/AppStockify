export interface Transaction {
    id: number;
    identifier: string;
    date: string;
    type: string;
    warehouse_id: number;
    client_id: number | null;
  }
  
  export interface CreateUpdateTransactionRequest {
    identifier: string;
    type: string;
    warehouse_id: number;
    client_id: number | null;
  }
  
  export interface ResponseTransaction {
    id: number;
    identifier: string;
    date: string;
    type: string;
    warehouse_id: number;
    client_id: number | null;
  }
  