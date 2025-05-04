export interface BankAccount {
    id: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    branchName: string;
  }
  
  export interface CreateBankAccount {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    branchName: string;
  }
  
  export interface UpdateBankAccount extends CreateBankAccount {
    id: string;
  }
  