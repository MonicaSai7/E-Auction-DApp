# E-Auction-DApp

A Decentralized Application, also known as a “DApp”, are applications that run on a decentralized peer-to-peer network and are governed by all the members, as opposed to a single entity that centrally owns the underlying servers and databases. In Ethereum, a DApp is backed by a smart contract containing the business logic. This makes a DApp to run on the Ethereum blockchain. The smart contract is developed using Solidity, an object-oriented, high-level language for implementing smart contracts on blockchain platforms.

## Structure

```contracts/```: Contains all the smart contracts.<br>
```migrations/```: These migrations are similar to other web development frameworks that require migrations to change the state of a database. Whenever we deploy smart contracts to the blockchain, we are updating the blockchain's state, and therefore need a migration.<br>
```src/```: Contains client-side application<br>
```truffle-config.js```: Main configuration file for the Truffle project.
