"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = require("../validate");
const symbol_1 = require("../helper/symbol");
class Point {
    constructor(longitude, latitude) {
        validate_1.Validate.isGeopoint("longitude", longitude);
        validate_1.Validate.isGeopoint("latitude", latitude);
        this.longitude = longitude;
        this.latitude = latitude;
    }
    parse(key) {
        return {
            [key]: {
                type: 'Point',
                coordinates: [this.longitude, this.latitude]
            }
        };
    }
    toJSON() {
        return {
            type: 'Point',
            coordinates: [
                this.longitude,
                this.latitude,
            ],
        };
    }
    get _internalType() {
        return symbol_1.SYMBOL_GEO_POINT;
    }
}
exports.Point = Point;
