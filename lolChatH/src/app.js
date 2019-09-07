const express = require('express');
const port = process.env.PORT || 3000;
const userRouter = require('./routers/user');
const commentRouter = require('./routers/comments');
require('./db/db');

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(commentRouter);
app.use(express.static('./'));

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

