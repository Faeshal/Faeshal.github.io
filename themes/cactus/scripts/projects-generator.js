/**
* Projects Generator
* @description Paginate the `Projects` page (5 per page) from source/_data/projects.yml,
* reusing Hexo's built-in pagination helper the same way generator-archive/generator-index do.
*/
const pagination = require('hexo-pagination');

hexo.extend.generator.register('projects', function (locals) {
    const projects = locals.data.projects;
    if (!projects || !projects.length) return;

    const perPage = 5;
    return pagination('projects/', projects, {
        perPage,
        layout: ['projects'],
        format: 'page/%d/',
        data: { title: 'Projects', perPage }
    });
});
