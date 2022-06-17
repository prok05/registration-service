/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
let requests = require('../data/request.json');

const router = express.Router();


router.get('/', (req, res) => {
    res.send(requests)
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const foundRequest = requests.find((req) => req.id === parseInt(id));
    res.send(foundRequest);
});

router.get('/status/:id', (req, res) => {
    const { id } = req.params;
    const foundRequest = requests.find((req) => req.id === parseInt(id));
    res.send(foundRequest.status.code)
})

router.post('/', (req, res) => {
    const request = req.body;
    const hasRequest = requests.some(req => req.id === request.id)
    if (request.status.code === 'PROCESSING' && hasRequest) {
        request.status.code = 'SUCCESS';
        const foundIndex = requests.findIndex(req => req.id === request.id);
        requests.splice(foundIndex, 1, request);
        res.send(request)
    } else if (request.status.code === 'PROCESSING') {
        request.status.code = 'SUCCESS';
        requests.push(request);
        console.log(request)
        res.send(request)
    } else if (request.status.code === 'DRAFT' && hasRequest) {
        const foundIndex = requests.findIndex(req => req.id === request.id);
        requests.splice(foundIndex, 1, request);
        res.send('Draft saved');
    } else if (request.status.code === 'DRAFT') {
        requests.push(request)
        res.send('Draft saved')
    }
})

router.get('/processing', (req, res) => {
    const hasProcessing = requests.some((req) => req.status.code === 'PROCESSING')
    res.send(hasProcessing)
})


router.post('/registration', (req, res) => {
    const request = req.body;
    request.status.code = 'PROCESSING';
    console.log(request)
})

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const request = req.body;
    const foundIndex = requests.findIndex(req => req.id === parseInt(id));
    requests.splice(foundIndex, 1, request)
    res.send('success')
})

module.exports = router;