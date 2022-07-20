

export const getRandom = async (length: number) => {

    let accountNumbers = Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));
  
    return accountNumbers
  }
  
  
  