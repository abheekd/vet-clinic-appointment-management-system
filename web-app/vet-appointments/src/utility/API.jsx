export const postData = (url = "", data = {}) => {
  // Default options are marked with *
  return fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  }).then(response => {
    return response.json();
  }); // parses JSON response into native JavaScript objects
};

export const getData = async (url = "") => {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "GET"
  });
  return response.json(); // parses JSON response into native JavaScript objects
};

export const deleteData = async (url = "") => {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "DELETE"
  });
  return response.json(); // parses JSON response into native JavaScript objects
};
