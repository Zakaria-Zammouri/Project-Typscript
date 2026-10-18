"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpellRepository = exports.WizardRepository = exports.Repository = void 0;
const decorators_1 = require("./decorators");
class Repository {
    items = [];
    add(item) {
        this.items.push(item);
    }
    findById(id) {
        return this.items.find(item => item.id === id);
    }
    getAll() {
        return [...this.items];
    }
    update(id, changes) {
        const item = this.findById(id);
        if (!item)
            return false;
        Object.assign(item, changes);
        return true;
    }
}
exports.Repository = Repository;
__decorate([
    decorators_1.Log
], Repository.prototype, "add", null);
__decorate([
    decorators_1.MeasureTime
], Repository.prototype, "findById", null);
class WizardRepository extends Repository {
}
exports.WizardRepository = WizardRepository;
class SpellRepository extends Repository {
}
exports.SpellRepository = SpellRepository;
