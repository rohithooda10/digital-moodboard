import axios from "axios";

export default axios.create({
  baseUrl: "https://api.unsplash.com/",
  headers: {
    // My access key
    Authorization: "Client-ID ZwnOEDGDOL52viKTH5QzOk1R8ksDbuRsa2G7uA9XaQk",
  },
});
