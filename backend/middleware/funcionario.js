// Backend/middleware/funcionario.js
// Verifica que el usuario sea funcionario o admin
// (los admin pueden hacer todo lo que hacen los funcionarios)

module.exports = function verificarFuncionario(req, res, next) {
    const rol = req.usuario?.rol;
    if (rol !== 'funcionario' && rol !== 'admin') {
        return res.status(403).json({
            error: 'Acceso denegado - se requiere rol funcionario o admin'
        });
    }
    next();
}