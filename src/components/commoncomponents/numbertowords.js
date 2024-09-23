export const numberToWords = (num) => {
    const ones = [
      '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
      'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
    ];
  
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  
    const scales = ['', 'thousand', 'lakh', 'crore'];
  
    if (num === 0) return 'zero';
  
    const chunk = (n, v) => {
      let str = '';
      if (n > 99) {
        str += ones[Math.floor(n / 100)] + ' hundred ';
        n %= 100;
      }
      if (n > 19) {
        str += tens[Math.floor(n / 10)] + ' ';
        n %= 10;
      }
      str += ones[n];
      return str.trim() + (v ? ' ' + scales[v] : '');
    };
  
    const splitNumber = (num) => {
      const arr = [];
      let i = 0;
      while (num > 0) {
        if (i === 1) {
          arr.push(num % 100); // Thousand chunk
          num = Math.floor(num / 100);
        } else {
          arr.push(num % 1000); // Lakh and Crore chunks
          num = Math.floor(num / 1000);
        }
        i++;
      }
      return arr;
    };
  
    const handleWholeNumber = (num) => {
      let words = '';
      const numberChunks = splitNumber(num);
      for (let j = 0; j < numberChunks.length; j++) {
        if (numberChunks[j]) {
          words = chunk(numberChunks[j], j) + ' ' + words;
        }
      }
      return words.trim();
    };
  
    const handleDecimalPart = (decimal) => {
      if (decimal.length > 2) {
        decimal = decimal.slice(0, 2); // Limiting to 2 decimal places
      }
      const decimalNum = parseInt(decimal, 10);
      return decimalNum ? numberToWords(decimalNum) + ' paise' : '';
    };
  
    const numParts = num.toString().split('.');
    const wholeNumberPart = parseInt(numParts[0], 10);
    const decimalPart = numParts[1] ? numParts[1] : '0';
  
    const words = handleWholeNumber(wholeNumberPart);
    const decimalWords = handleDecimalPart(decimalPart);
  
    return decimalWords ? `${words} rupees and ${decimalWords}` : `${words} rupees`;
  };
  