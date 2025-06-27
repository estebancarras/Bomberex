"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("firebase/app");
var firestore_1 = require("firebase/firestore");
// Configuración Firebase (ajustar con la configuración real del proyecto)
var firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
function insertMantenimientos() {
    return __awaiter(this, void 0, void 0, function () {
        var app, db, vehiculosSnapshot, vehiculos, tipos, estados, prioridades, talleres, mantenimientoCount, _i, vehiculos_1, vehiculo, numMantenimientos, i, mantenimiento;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = (0, app_1.initializeApp)(firebaseConfig);
                    db = (0, firestore_1.getFirestore)(app);
                    return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.collection)(db, "vehiculos"))];
                case 1:
                    vehiculosSnapshot = _a.sent();
                    vehiculos = vehiculosSnapshot.docs.map(function (doc) {
                        var data = doc.data();
                        return __assign({ id: doc.id }, data);
                    });
                    if (vehiculos.length === 0) {
                        console.log("No hay vehículos en la base de datos.");
                        return [2 /*return*/];
                    }
                    tipos = ["Preventivo", "Correctivo", "Inspección"];
                    estados = ["Pendiente", "En progreso", "Completado"];
                    prioridades = ["baja", "media", "alta"];
                    talleres = ["Taller Central", "Taller Norte", "Taller Sur"];
                    mantenimientoCount = 0;
                    _i = 0, vehiculos_1 = vehiculos;
                    _a.label = 2;
                case 2:
                    if (!(_i < vehiculos_1.length)) return [3 /*break*/, 7];
                    vehiculo = vehiculos_1[_i];
                    numMantenimientos = Math.floor(Math.random() * 3) + 2;
                    i = 0;
                    _a.label = 3;
                case 3:
                    if (!(i < numMantenimientos)) return [3 /*break*/, 6];
                    mantenimiento = {
                        tipo: tipos[Math.floor(Math.random() * tipos.length)],
                        descripcion: "Mantenimiento de tipo ".concat(tipos[i % tipos.length], " para veh\u00EDculo ").concat(vehiculo.vehiculo || vehiculo.nombre || vehiculo.id),
                        fecha: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
                        vehiculo: vehiculo.id,
                        estado: estados[Math.floor(Math.random() * estados.length)],
                        completado: false,
                        tiempomanteni: [new Date().toISOString()],
                        categoria: tipos[Math.floor(Math.random() * tipos.length)],
                        patente: vehiculo.patente || "N/A",
                        prioridad: prioridades[Math.floor(Math.random() * prioridades.length)],
                        tallerResponsable: talleres[Math.floor(Math.random() * talleres.length)]
                    };
                    return [4 /*yield*/, (0, firestore_1.addDoc)((0, firestore_1.collection)(db, "mantenimientos"), mantenimiento)];
                case 4:
                    _a.sent();
                    mantenimientoCount++;
                    if (mantenimientoCount >= 10) {
                        console.log("Se han insertado ".concat(mantenimientoCount, " mantenimientos."));
                        return [2 /*return*/];
                    }
                    _a.label = 5;
                case 5:
                    i++;
                    return [3 /*break*/, 3];
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7:
                    console.log("Se han insertado ".concat(mantenimientoCount, " mantenimientos."));
                    return [2 /*return*/];
            }
        });
    });
}
insertMantenimientos().catch(console.error);
