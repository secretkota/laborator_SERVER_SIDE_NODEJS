export const pageNotFound = (req, res) => {
    res.status(404).render('404Page', {
        codeError: '404 Страница не найдена'
    });
};

