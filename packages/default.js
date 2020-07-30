module.exports = {
  links: [
    {
      source: "Staking Pool",
      target: "Besu Redis",
    },
    {
      source: "Staking Pool",
      target: "Event Stream Layer",
    },
    {
      source: "Staking Pool",
      target: "Authority Node",
    },
    {
      source: "Staking Pool",
      target: "Kafka/MQ",
    },
    {
      source: "Staking Pool",
      target: "Fail Over Node",
    },
    {
      source: "Staking Pool",
      target: "AUX",
    },
    {
      source: "Besu Redis",
      target: "Authority Node",
    },
    {
      source: "Besu Redis",
      target: "Kafka/MQ",
    },
    {
      source: "Besu Redis",
      target: "Fail Over Node",
    },
    {
      source: "Besu Redis",
      target: "AUX",
    },
    {
      source: "Event Stream Layer",
      target: "Kafka/MQ",
    },
    {
      source: "Event Stream Layer",
      target: "Fail Over Node",
    },
    {
      source: "Event Stream Layer",
      target: "AUX",
    },
    {
      source: "Authority Node",
      target: "Fail Over Node",
    },
    {
      source: "Authority Node",
      target: "AUX",
    },
    {
      source: "Fail Over Node",
      target: "AUX",
    },
    {
      source: "Staking Pool",
      target: "Guardian",
    },
    {
      source: "Besu Redis",
      target: "AS2 Protocol",
    },
    {
      source: "Event Stream Layer",
      target: "Persistance Layer",
    },
    {
      source: "Authority Node",
      target: "Kube Pod",
    },
    {
      source: "Kafka/MQ",
      target: "Maidenlane",
    },
    {
      source: "Fail Over Node",
      target: "Message Broker",
    },
    {
      source: "AUX",
      target: "Ethereum Mainnet",
    },
  ],
  nodes: [
    {
      id: "Staking Pool",
    },
    {
      id: "Besu Redis",
    },
    {
      id: "Event Stream Layer",
    },
    {
      id: "Authority Node",
    },
    {
      id: "Kafka/MQ",
    },
    {
      id: "Fail Over Node",
    },
    {
      id: "AUX",
    },
    {
      id: "Guardian",
      symbolType: "square",
    },
    {
      id: "AS2 Protocol",
      symbolType: "square",
    },
    {
      id: "Persistance Layer",
      symbolType: "square",
    },
    {
      id: "Kube Pod",
      symbolType: "square",
    },
    {
      id: "Maidenlane",
      symbolType: "square",
    },
    {
      id: "Message Broker",
      symbolType: "square",
    },
    {
      id: "Ethereum Mainnet",
      symbolType: "square",
    },
  ],
};
