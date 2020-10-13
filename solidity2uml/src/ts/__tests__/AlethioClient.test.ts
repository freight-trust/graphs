import {
  getContractMessages,
  getEtherTransfers,
  getToken,
  getTokenTransfers,
  getTransactionDetails,
  getTransfers,
} from "../AlethioClient";
import { getTransaction, MessageType } from "../transaction";
import BigNumber from "bignumber.js";

jest.setTimeout(60000); // timeout for each test in milliseconds

describe("Alethio parser", () => {
  describe("1inch", () => {
    test("get transaction contract call", async () => {
      const transactionInfo = await getTransaction(
        "0x34e4f8b86b5c3fe5a9e30e7cf75b242ed3e6e4eeea68cfaf3ca68ef1edb93ed1"
      );
      expect(transactionInfo.details.status).toEqual(true);
      expect(transactionInfo.messages).toHaveLength(95);
      expect(transactionInfo.messages[0].gasLimit).toEqual(BigInt(996456));
    }, 100000);
    test("get success transaction", async () => {
      const [tx, firstMessage] = await getTransactionDetails(
        "0xbc979bfcd136884dc6c0d7243696f3443d6c9f9cc478c3189cb021968e3e31b2"
      );
      expect(tx.nonce).toEqual(49826);
      expect(tx.status).toEqual(true);
      expect(tx.index).toEqual(54);
      expect(tx.value).toEqual(BigInt(0));
      expect(tx.gasPrice).toEqual(BigInt(30000000000));
      expect(firstMessage.gasUsed).toEqual(BigInt(214283));
      expect(firstMessage.gasLimit).toEqual(BigInt(509859));
    });
    test("get messages", async () => {
      const messages = await getContractMessages(
        "0xbc979bfcd136884dc6c0d7243696f3443d6c9f9cc478c3189cb021968e3e31b2"
      );
      expect(messages).toHaveLength(29);
      expect(messages[0].type).toEqual(MessageType.Call);
      expect(messages[0].value).toEqual(new BigNumber(0));
      expect(messages[0].gasLimit).toEqual(BigInt(466557));
      expect(messages[0].gasUsed).toEqual(BigInt(114411));
      expect(messages[7].type).toEqual(MessageType.Delegatecall);
      expect(messages[8].delegatedCall?.id).toEqual(0);
      expect(messages[8].delegatedCall?.last).toBeFalsy();
      expect(messages[9].delegatedCall?.id).toEqual(1);
      expect(messages[10].delegatedCall?.id).toEqual(2);
      expect(messages[10].delegatedCall?.last).toBeTruthy();

      expect(messages[9].type).toEqual(MessageType.Call);
      expect(messages[9].payload.funcSelector).toEqual("");
      expect(messages[9].payload.funcName).toEqual("");

      expect(messages[14].type).toEqual(MessageType.Value);
    });
  });
  test("get token transfers", async () => {
    const transfers = await getTokenTransfers(
      "0xe2e3ef2513c8e3da306cb427c03ae0114062fd09568bec559d5880c490ff743a"
    );
    expect(transfers).toHaveLength(4);
    expect(transfers[0].id).toEqual(38);
    expect(transfers[0].symbol).toEqual("WETH");
    expect(transfers[0].from).toEqual(
      "0x1e158c0e93c30d24e918ef83d1e0be23595c3c0f"
    );
    expect(transfers[0].to).toEqual(
      "0xa57bd00134b2850b2a1c55860c9e9ea100fdd6cf"
    );
    expect(transfers[0].decimals).toEqual(18);
    expect(transfers[0].value).toEqual(new BigNumber("12.713604029683001399"));
    expect(transfers[0].gasLimit).toEqual(BigInt(1150000));
    expect(transfers[0].gasUsed).toEqual(BigInt(542899));

    expect(transfers[3].id).toEqual(42);
    expect(transfers[3].symbol).toEqual("DAI");
    expect(transfers[3].from).toEqual(
      "0x65bf64ff5f51272f729bdcd7acfb00677ced86cd"
    );
    expect(transfers[3].to).toEqual(
      "0x0f626f3ecffcf9cc97c0f2f8307d4501f15908a9"
    );
    expect(transfers[3].decimals).toEqual(18);
    expect(transfers[3].value).toEqual(
      new BigNumber("3447.548131875179830942")
    );
    expect(transfers[3].gasLimit).toEqual(BigInt(1150000));
    expect(transfers[3].gasUsed).toEqual(BigInt(542899));
  });
  test("get ether transfers", async () => {
    const transfers = await getEtherTransfers(
      "0xe2e3ef2513c8e3da306cb427c03ae0114062fd09568bec559d5880c490ff743a"
    );
    expect(transfers).toHaveLength(3);
    expect(transfers[0].id).toEqual(2);
    expect(transfers[0].from).toEqual(
      "0x818e6fecd516ecc3849daf6845e3ec868087b755"
    );
    expect(transfers[0].to).toEqual(
      "0x65bf64ff5f51272f729bdcd7acfb00677ced86cd"
    );
    expect(transfers[0].value).toEqual(new BigNumber("12.7136040296830014"));
  });

  test("get transfers", async () => {
    const transfers = await getTransfers(
      "0xe2e3ef2513c8e3da306cb427c03ae0114062fd09568bec559d5880c490ff743a"
    );
    expect(transfers).toHaveLength(7);
    expect(transfers[0].id).toEqual(2);
    expect(transfers[0].from).toEqual(
      "0x818e6fecd516ecc3849daf6845e3ec868087b755"
    );
    expect(transfers[0].to).toEqual(
      "0x65bf64ff5f51272f729bdcd7acfb00677ced86cd"
    );
    expect(transfers[0].value).toEqual(new BigNumber("12.7136040296830014"));
  });

  describe("get transaction details from Alethio", () => {
    test("get failed transaction", async () => {
      const [tx, firstMessage] = await getTransactionDetails(
        "0x7699bdafead1714980503ef14806d9846153b01145c793176439c2a9c91a6237"
      );
      expect(tx.nonce).toEqual(2549);
      expect(tx.status).toEqual(false);
      expect(tx.error).toEqual("Bad instruction");
      expect(tx.index).toEqual(81);
      expect(tx.value).toEqual(BigInt(0));
      expect(tx.gasPrice).toEqual(BigInt(5000000000));
      expect(firstMessage.gasUsed).toEqual(BigInt(60000));
      expect(firstMessage.gasLimit).toEqual(BigInt(60000));
    });
  });

  describe("get token details", () => {
    test("Tether USD", async () => {
      const token = await getToken(
        "0xdac17f958d2ee523a2206206994597c13d831ec7"
      );
      expect(token.address).toEqual(
        "0xdac17f958d2ee523a2206206994597c13d831ec7"
      );
      expect(token.symbol).toEqual("USDT");
      expect(token.name).toEqual("Tether USD");
      expect(token.decimals).toEqual(6);
    });
    test("Failed as ENS contract", async () => {
      const token = await getToken(
        "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
      );
      expect(token).toEqual(null);
    });
  });
});
