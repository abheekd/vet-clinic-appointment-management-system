export const postData = (url = '', data = {}) => {
  // Default options are marked with *
  return fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => {
      return response.json()
    })
    .catch(error => {
      console.error('Error:', error)
      this.setState({
        errorMessage: error.message
      });
    }); // parses JSON response into native JavaScript objects
};

export const getData = (url = '') => {
  // Default options are marked with *
  return fetch(url, {
      method: 'GET'
    })
    .then(response => {
      return response.json()
    })
    .catch(error => {
      console.error('Error:', error)
      this.setState({
        errorMessage: error.message
      });
    }); // parses JSON response into native JavaScript objects
};
