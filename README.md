# Frontend Challenge
<p>This project is a challenge to build a mortgage options calculator using hypofriend Graphql API. The calculator is a feature is to display information in real-time based on the input values, and the submission of the form fields sends a request to the GraphQL endpoint, which will return a payload to display a list of different loan options.</p>

## Technologies
<p>This project is built with just Vue.JS, vuetfiy and apollo clinte (vue-apollo) </p>

## Name and Email

Name: AlbashirMohamed Alghreb

Email: albasheer0@icloud.com

## Architecture

<p>The application follows a simple architecture where the components are organized in a modular way. The main App.vue component is responsible for rendering child components and passing down props and events. The form fields are divided into individual components, and the validation logic is implemented using vuetify rules.

    If this feature were part of a larger application, it would be essential to keep the code modular and easy to maintain. One potential challenge could be managing state across multiple components, which could be solved by using a state management library like Vuex. but for this implementation, it would have been an overdo</p>

## Browser and Device Support
<p>The application is designed to support modern web browsers and devices. I have tested it on the latest versions of Chrome, Firefox, Safari, and Edge. As for devices, the application is responsive and should work well on desktops, tablets, and mobile phones.</p>

## Testing

<p>The application includes basic unit tests using jest for the components and validation functions and form submission. To improve the test coverage and effectiveness, it would be useful to add more tests for edge cases and boundary conditions. Also, it would be helpful to add end-to-end tests to simulate user interactions and ensure the application is working as expected.</p>

## CORS Issues

<p>To solve issues CORS  when sending requests to the API a solution would be to configure the server to allow cross-origin requests from the domain of the application this is done by modifying the Apollo client involves adding the "sec-fetch-mode" and "sec-fetch-site" headers with the values "cors" and "same-origin" respectively. This tells the browser to make a CORS request and include credentials in the request. The "credentials" option set to "include" also tells the server to include cookies and authentication headers in the request. By including these headers and options in the Apollo client, the server can properly handle the CORS request and allow the client to access the requested resources. This is a common approach to solving CORS issues and is widely used in web applications that require cross-domain requests.</p>

```
const apolloClient = new ApolloClient({
    link: httpLink,
    headers: {
        accept: "*/*",
        "accept-language": "en,de;q=0.9,cs;q=0.8",
        "cache-control": "no-cache",
        "content-type": "application/json",
        pragma: "no-cache",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
    },
    credentials: "include",
    cache,
});

```


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
