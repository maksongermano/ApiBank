const app = require('./servidor');
const rotas = require('./roteador');

app.use(rotas);

app.listen(3000);