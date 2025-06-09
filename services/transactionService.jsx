import { request } from "./request";

const transactionService = {
  getTransactions: (params) =>
    request("GET", "v1/transaction", null, {}, params),
};

export default transactionService;
