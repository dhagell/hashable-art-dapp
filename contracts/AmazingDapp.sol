pragma solidity >=0.5.16;

contract AmazingDapp {
	mapping (string => bool) private names;
	
	function checkIfExist(string memory name) public view returns (bool){
		return names[name];
	}
	function registerName(string memory name) public {
		names[name] = true;
	}
}