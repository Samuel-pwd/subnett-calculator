/* ===== VALIDATION FUNCTIONS ===== */

// Quick check if an IP is actually valid (4 parts, each 0–255, no weird zeros)
function isValidIP(ip) {
  const octets = ip.split('.');
  if (octets.length !== 4) return false;
  
  for (let octet of octets) {
    const num = parseInt(octet, 10);
    // If it's not a number, or out of range, or written funny like "02"
    if (isNaN(num) || num < 0 || num > 255) return false;
    if (octet !== num.toString()) return false;
  }
  
  return true;
}

// Accepts either "24", "/24", or a full mask like "255.255.255.0"
function parseSubnetInput(input) {
  input = input.trim();
  
  // First, try treating it like CIDR
  let cidr = parseInt(input.replace('/', ''), 10);
  if (!isNaN(cidr) && cidr >= 0 && cidr <= 32) {
    return cidr;
  }
  
  // If not CIDR, maybe it's a normal mask
  if (isValidIP(input)) {
    return maskToCIDR(input);
  }
  
  throw new Error('Invalid subnet. Use CIDR (0–32) or a subnet mask.');
}

// Turns a mask into CIDR by counting how many left-side bits are 1
function maskToCIDR(mask) {
  const maskInt = ipToInt(mask);
  
  let cidr = 0;
  // Walk from left to right counting the 1s
  for (let i = 31; i >= 0; i--) {
    if ((maskInt >> i) & 1) cidr++;
    else break;
  }
  
  // Make sure the mask is "all 1s then all 0s"
  const expected = (0xFFFFFFFF << (32 - cidr)) >>> 0;
  if (maskInt !== expected) {
    throw new Error('Invalid subnet mask format');
  }
  
  return cidr;
}

/* ===== CONVERSION FUNCTIONS ===== */

// Converts "192.168.1.5" into a 32-bit number so we can do bitwise math
function ipToInt(ip) {
  const octets = ip.split('.').map(Number);
  return (octets[0] << 24) + (octets[1] << 16) + (octets[2] << 8) + octets[3];
}

// Converts a 32-bit number back into an IP string
function intToIp(int) {
  return [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255
  ].join('.');
}

// Turns CIDR like /24 into its mask (255.255.255.0)
function cidrToMask(cidr) {
  if (cidr === 0) return '0.0.0.0';
  if (cidr === 32) return '255.255.255.255';
  
  const maskInt = (0xFFFFFFFF << (32 - cidr)) >>> 0;
  return intToIp(maskInt);
}

/* ===== MAIN CALCULATION ===== */

// Where the actual subnet math happens
function calculateSubnet(ip, cidr) {
  const ipInt = ipToInt(ip);
  const maskInt = ipToInt(cidrToMask(cidr));
  
  // Network = IP but with host bits wiped out
  const networkInt = (ipInt & maskInt) >>> 0;
  const network = intToIp(networkInt);
  
  // Wildcard = opposite of mask (host bits turned on)
  const wildcardInt = (~maskInt) >>> 0;
  const wildcard = intToIp(wildcardInt);
  
  // Broadcast = last address in the network
  const broadcastInt = (networkInt | wildcardInt) >>> 0;
  const broadcast = intToIp(broadcastInt);
  
  let firstHost, lastHost, totalHosts;
  const hostBits = 32 - cidr;
  
  // Special networks that don’t behave like normal ones
  if (cidr === 32) {
    firstHost = network;
    lastHost = network;
    totalHosts = 1;
  } else if (cidr === 31) {
    firstHost = network;
    lastHost = broadcast;
    totalHosts = 2;
  } else {
    // Normal subnet: skip network & broadcast
    firstHost = intToIp(networkInt + 1);
    lastHost = intToIp(broadcastInt - 1);
    totalHosts = Math.pow(2, hostBits) - 2;
  }
  
  return {
    ip,
    cidr,
    
    subnetMask: cidrToMask(cidr),
    wildcardMask: wildcard,
    networkAddress: network,
    broadcastAddress: broadcast,
    firstHost,
    lastHost,
    
    totalHosts: formatNumber(totalHosts),
    totalAddresses: formatNumber(Math.pow(2, hostBits)),
    hostBits,
    networkBits: cidr,
    
    ipBinary: ipInt.toString(2).padStart(32, '0'),
    maskBinary: maskInt.toString(2).padStart(32, '0')
  };
}

// Adds commas to big numbers
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/* ===== DISPLAY FUNCTIONS ===== */

// Builds the output UI with all the network info
function displayResults(results) {
  const output = document.getElementById('output');
  output.innerHTML = '';
  
  const items = [
    { label: 'IP Address', value: `${results.ip}/${results.cidr}` },
    { label: 'Subnet Mask', value: results.subnetMask },
    { label: 'Wildcard Mask', value: results.wildcardMask },
    { label: 'Network Address', value: results.networkAddress },
    { label: 'Broadcast Address', value: results.broadcastAddress },
    { label: 'First Usable Host', value: results.firstHost },
    { label: 'Last Usable Host', value: results.lastHost },
    { label: 'Address Range', value: `${results.firstHost} - ${results.lastHost}` },
    { label: 'Total Usable Hosts', value: results.totalHosts },
    { label: 'Total Addresses', value: results.totalAddresses },
    { label: 'Network Bits', value: results.networkBits },
    { label: 'Host Bits', value: results.hostBits }
  ];
  
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'result-item';
    div.innerHTML = `
      <div class="result-label">${item.label}</div>
      <div class="result-value">${item.value}</div>
    `;
    output.appendChild(div);
  });
}

// Shows an error box if user types something wrong
function displayError(message) {
  const output = document.getElementById('output');
  output.innerHTML = `
    <div class="error">
      <strong>Error:</strong> ${message}
    </div>
  `;
}

// Clears all inputs and output
function clearCalculator() {
  document.getElementById('ip-input').value = '';
  document.getElementById('mask-input').value = '';
  document.getElementById('output').innerHTML = 
    '<p class="placeholder">Enter IP and CIDR above to see results</p>';
}

/* ===== EVENT HANDLERS ===== */

// All button click/Enter-key behaviour
document.addEventListener('DOMContentLoaded', function() {
  const ipInput = document.getElementById('ip-input');
  const maskInput = document.getElementById('mask-input');
  const calculateBtn = document.getElementById('calculate-btn');
  const clearBtn = document.getElementById('clear-btn');
  
  calculateBtn.addEventListener('click', function() {
    const ip = ipInput.value.trim();
    const maskInputValue = maskInput.value.trim();
    
    try {
      if (!isValidIP(ip)) {
        throw new Error('Invalid IP address. Use four numbers separated by dots.');
      }
      
      const cidr = parseSubnetInput(maskInputValue);
      const results = calculateSubnet(ip, cidr);
      
      displayResults(results);
      
    } catch (error) {
      displayError(error.message);
    }
  });
  
  clearBtn.addEventListener('click', clearCalculator);
  
  ipInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') calculateBtn.click();
  });
  
  maskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') calculateBtn.click();
  });
});