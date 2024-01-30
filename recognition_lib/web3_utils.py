import json
from web3 import Web3  # Ajoutez cette ligne pour importer Web3

contract = None

net_url = "http://localhost:8545"  # Remplacez cela par l'URL de votre nœud Web3
web3 = Web3(Web3.HTTPProvider(net_url))

def connect():
    global contract
    # Récupération du fichier abi
    with open('ProjectTokenFactory.json', 'r') as contract_file:
        contract_data = json.load(contract_file)
        abi = contract_data.get("abi")

    with open('Address.json', 'r') as address_file:
        address_data = json.load(address_file)
        address = address_data.get("address")

    contract = web3.eth.contract(address=address, abi=abi)


def update_whitelist(eth_address, status):
    global contract

    if contract is not None:
        private_key = 'YOUR_PRIVATE_KEY'
        account = web3.eth.account.privateKeyToAccount(private_key)

        txn_dict = contract.functions.whitelistUser(eth_address, status).buildTransaction({
            'gas': 2000000,
            'gasPrice': web3.toWei('50', 'gwei'),
            'nonce': web3.eth.getTransactionCount(account.address),
        })

        signed_txn = web3.eth.account.signTransaction(txn_dict, private_key)

        tx_hash = web3.eth.sendRawTransaction(signed_txn.rawTransaction)

        web3.eth.waitForTransactionReceipt(tx_hash)
