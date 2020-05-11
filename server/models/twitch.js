import axios from 'axios'

let twitchApi = axios.create({
    headers: {
        'Client-ID': 'mqj20kyaldtty9ob3d3wv4if9o71pr'
    }
})

export default twitchApi;