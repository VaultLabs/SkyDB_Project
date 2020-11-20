const fetchRate = async (fiat) => {
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${fiat}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (e) {
    console.log(e);
  }

  return true;
};

export default fetchRate;
