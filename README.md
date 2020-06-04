# BBcoin - Minimalist blockchain/cryptocurrency

_What is the best solution to learn about blockhain that to create a one.._

BBcoin is a minimalist blockhain. It implement many of the main required functionnality and can be easily runned in localhost in order to test it and play with it.

## 🧰 Key Concepts

- P2P network
- Simple proof-of-work algorithm
- Verify blockchain (to prevent tampering)
- Conflicts resolution
- Interface to make transactions on wallets

## 🏁 Getting Started

### Quick Start

1. Clone the project `git clone https://github.com/fabremx/bbchain.git`
2. Launch the broker server and serve the frontend `npm run servers`
3. Wait until the broker server is launched
4. Launch `npm run nodes` which will create and add 4 nodes to your network

### Advanced Commands

**broker**

```js
npm run broker // Launch the broker server
```

**Node**

```js
npm run node // Create one node with P2P PORT 6001 and HTTP PORT 3001
set P2P_PORT=6002 && set HTTP_PORT=3002 && npm run node // Create one node with P2P PORT 6002 and HTTP PORT 3002
npm run client // Launch the frontend on localhost:8080
```

**Frontend**

```js
npm run client // Launch the frontend on localhost:8080
```

**Others**

```js
npm run build // build the application
npm run tests // Launch tests
```

WARNING: Before launching any nodes make sure you ran before the broker server.

## ⚙️ How Works BBcoin

#### Architecture

BBcoin is divided into several parts :

- The broker server: Allow to know the nodes connected to the network. No data passes to the broker server
- Node: All Nodes are connected together and share it's blochcain state.
- Client: Simple web page to see easily the blockhain informations

#### P2P Network

marche avec les websockets
explique le borker et les nodes
comment ça marche

#### Node structure

chaque est noeuf est full, light, miner
ils ont http server et websocket
Data is not persisted in nodes

#### Blockchain structure

elémént d'un block
genesis block

#### Proof of work

based on bitcoin
mine array of transactions
after the first transaction - wait 10 s before mining
difficulty 3 avec temps aléatoire pour simuler différence de puissance de calcul

#### Front end and Transactions

in case of demo allow to make transactions with any wallet to any wallet
see network nide infos
see blockchain info
