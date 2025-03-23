const apiKey = "e0e9734b64ce73a6fbe5a464d7567f5b";
const baseURL = "https://lager.emilfolino.se/v2";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiZTBlOTczNGI2NGNlNzNhNmZiZTVhNDY0ZDc1NjdmNWIiLCJlbWFpbCI6ImphY2xhbjE1QC5zZSIsImlhdCI6MTcxODQ1NjYxOSwiZXhwIjoxNzE4NTQzMDE5fQ.svzb4EKlrqVPrALAQMd8xR012HGRJSo4BybQSxJTF-M";

function toast(message) {
    const toast = document.getElementsByClassName("toast")[0];

    toast.querySelector(".toast-body").innerHTML = message;

    toast.classList.add("visible");

    setTimeout(function() {
        toast.className = toast.className.replace("visible", "");
    }, 3000);
}

export {apiKey, baseURL, toast, token};
