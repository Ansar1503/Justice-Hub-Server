"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
module.exports = function (plop) {
    plop.setGenerator("usecase", {
        description: "Generate a new use case with DTO, Mapper, Controller, Composer",
        prompts: [
            {
                type: "input",
                name: "name",
                message: "Use case name (e.g. AddCaseType):",
            },
        ],
        actions: [
            {
                type: "add",
                path: "src/usecases/{{pascalCase name}}/I{{pascalCase name}}.ts",
                templateFile: "plop-templates/IUseCase.hbs",
            },
            {
                type: "add",
                path: "src/usecases/{{pascalCase name}}/{{pascalCase name}}.ts",
                templateFile: "templates/UseCase.hbs",
            },
            {
                type: "add",
                path: "src/dtos/{{pascalCase entity}}Dto.ts",
                templateFile: "templates/Dto.hbs",
            },
            {
                type: "add",
                path: "src/mappers/{{pascalCase entity}}Mapper.ts",
                templateFile: "templates/Mapper.hbs",
            },
            {
                type: "add",
                path: "src/controllers/{{pascalCase name}}Controller.ts",
                templateFile: "templates/Controller.hbs",
            },
            {
                type: "add",
                path: "src/composers/{{pascalCase name}}Composer.ts",
                templateFile: "templates/Composer.hbs",
            },
        ],
    });
};
