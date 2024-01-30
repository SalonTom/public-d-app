import json
from web3 import Web3

contract = None

net_url = "URL_DU_NOEUD_WEB3"
web3 = Web3(Web3.HTTPProvider(net_url))
def connect():
    print('a')

def update_whitelist(eth_address, status):
    print("b")

def connect():
    global contract
    # Récupération du fichier abi
    with open('chemin_vers_le_fichier_abi.json', 'r') as f:
        abi = json.load(f)

    with open('Address.json', 'r') as address_file:
        address_data = json.load(address_file)
        address = address_data.get("address")

    contract = web3.eth.contract(address=address, abi=abi)


def update_whitelist(eth_address, status):
    global contract

    if contract is not None:
        # Remplacer par la clé privée d'un compte générée par la blockchain locale
        private_key = 'YOUR_PRIVATE_KEY'
        account = web3.eth.account.privateKeyToAccount(private_key)

        txn_dict = contract.functions.updateStatusWhitelist(eth_address, status).buildTransaction({
            'gas': 2000000,
            'gasPrice': web3.toWei('50', 'gwei'),
            'nonce': web3.eth.getTransactionCount(account.address),
        })

        signed_txn = web3.eth.account.signTransaction(txn_dict, private_key)

        tx_hash = web3.eth.sendRawTransaction(signed_txn.rawTransaction)

        web3.eth.waitForTransactionReceipt(tx_hash)
