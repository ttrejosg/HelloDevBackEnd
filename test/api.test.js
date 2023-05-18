import request from "supertest";
import app from "../src/app.js";

/**
 * Testing articles creation post route.
 */
describe("/POST /articulos", () => {
	const portada = "./test/files/test.jpg";
	const archivo = "./test/files/test.pdf";

	it("Respond whit a 500 status and a json containing the error message = falta titulo y resumen", (done) => {
		const expectedMessage = `{"message":"Falta titulo y resumen"}`;
		request(app)
			.post("/articulos")
			.field("titulo", "")
			.field("resumen", "")
			.field("id_autor", 1)
			.attach("portada", portada)
			.attach("archivo", archivo)
			.set("Content-Type", "multipart/form-data")
			.expect(500)
			.expect(expectedMessage, done);
	});

	it("Respond whit a 500 status and a json containing the error message = falta titulo", (done) => {
		const expectedMessage = `{"message":"Falta titulo"}`;
		request(app)
			.post("/articulos")
			.field("titulo", "")
			.field("resumen", "Estos son códigos que estan rotundamente prohibidos")
			.field("id_autor", 1)
			.attach("portada", portada)
			.attach("archivo", archivo)
			.set("Content-Type", "multipart/form-data")
			.expect(500)
			.expect(expectedMessage, done);
	});

	it("Respond whit a 500 status and a json containing the error message = falta titulo", (done) => {
		const expectedMessage = `{"message":"Falta titulo"}`;
		request(app)
			.post("/articulos")
			.field("titulo", "")
			.field("resumen", "Estos son códigos que estan rotundamente prohibidos")
			.field("id_autor", 1)
			.attach("portada", null)
			.attach("archivo", null)
			.set("Content-Type", "multipart/form-data")
			.expect(500)
			.expect(expectedMessage, done);
	});

	it("Respond whit a 500 status and a json containing the error message = falta titulo", (done) => {
		const expectedMessage = `{"message":"Falta titulo"}`;
		request(app)
			.post("/articulos")
			.field("titulo", "")
			.field("resumen", "Estos son códigos que estan rotundamente prohibidos")
			.field("id_autor", 1)
			.attach("portada", null)
			.attach("archivo", archivo)
			.set("Content-Type", "multipart/form-data")
			.expect(500)
			.expect(expectedMessage, done);
	});

	it("Respond whit a 500 status and a json containing the error message = falta resumen", (done) => {
		const expectedMessage = `{"message":"Falta resumen"}`;
		request(app)
			.post("/articulos")
			.field("titulo", "Los códigos prohibidos")
			.field("resumen", "")
			.field("id_autor", 1)
			.attach("portada", portada)
			.attach("archivo", archivo)
			.expect(500)
			.expect(expectedMessage, done);
	});

	it("Respond whit a 500 status and a json containing the error message = falta archivo y portada", (done) => {
		const expectedMessage = `{"message":"Falta archivo y portada"}`;
		request(app)
			.post("/articulos")
			.field("titulo", "Los códigos prohibidos")
			.field("resumen", "Estos son códigos que estan rotundamente prohibidos")
			.field("id_autor", 1)
			.attach("portada", null)
			.attach("archivo", null)
			.set("Content-Type", "multipart/form-data")
			.expect(500)
			.expect(expectedMessage, done);
	});

	it("Respond with a 500 status and a json containing the error message = falta archivo", (done) => {
		const expectedMessage = `{"message":"Falta archivo"}`;
		request(app)
			.post("/articulos")
			.field("titulo", "Los códigos prohibidos")
			.field("resumen", "Estos son códigos que estan rotundamente prohibidos")
			.field("id_autor", 1)
			.attach("portada", portada)
			.attach("archivo", null)
			.set("Content-Type", "multipart/form-data")
			.expect(500)
			.expect(expectedMessage, done);
	});

	it("Respond with a 500 status and a json containing the error message = falta portada", (done) => {
		const expectedMessage = `{"message":"Falta portada"}`;
		request(app)
			.post("/articulos")
			.field("titulo", "Los códigos prohibidos")
			.field("resumen", "Estos son códigos que estan rotundamente prohibidos")
			.field("id_autor", 1)
			.attach("portada", null)
			.attach("archivo", archivo)
			.set("Content-Type", "multipart/form-data")
			.expect(500)
			.expect(expectedMessage, done);
	});

	it("Respond with a 500 status when there is no affected rows in the data base and a json containing the error message = no se pudo insertar el articulo", (done) => {
		const expectedMessage = `{"message":"No se pudo insertar el articulo"}`;
		request(app)
			.post("/articulos")
			.field("titulo", `Los códigos prohibidos" OR 1=1 #`)
			.field("resumen", "Estos son códigos que estan rotundamente prohibidos")
			.field("id_autor", 1)
			.attach("portada", portada)
			.attach("archivo", archivo)
			.set("Content-Type", "multipart/form-data")
			.expect(500)
			.expect(expectedMessage, done);
	});

	it("respond with json containing the id of the inserted article", (done) => {
		const expectedId = `{"id":16}`;
		request(app)
			.post("/articulos")
			.field("titulo", "Los códigos prohibidos")
			.field("resumen", "Estos son códigos que estan rotundamente prohibidos")
			.field("id_autor", 1)
			.attach("portada", portada)
			.attach("archivo", archivo)
			.set("Content-Type", "multipart/form-data")
			.expect(expectedId, done);
	});
});

/**
 * @type {Request}
 * @description Tests para la creación de notificaciones. La cual se usa para notificar a los autores que su articulo 
 * ha sido aceptado o rechazado. Además de notificar a los editores que un articulo ha sido enviado para su revisión.
 * También tiene en cuenta cuando se revierte el estado de un articulo por error.
*/
describe('POST /notificaciones', () => {

    /**
     * @type {Request} 
     * @description Se encarga de revisar si cuando un autor es el emisor de la notificación, el receptor es un editor y el estado
     * del articulo es 2 (Enviado para revisión), se obtiene un error.
     * @returns {JSON} {message: "El articulo ya ha sido enviado a revisión"}
     * @returns {Number} 500
     */
    it('should return an error', done => {
        const body = {
            id_emisor: 2,
            id_receptor: 1,
            mensaje: "Mensaje de prueba",
            id_articulo_notificacion: 2,
            id_estado: 2,
            new_estado: 2,
            fecha: new Date().toString()
        };
        Request(app)
        .post('/notificaciones')
        .send(body)
        .set("accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(500)
        .expect({message: "El articulo ya ha sido enviado a revisión"})
        .end((err,res) => {
            if (err) return done(err + " " + res.body.message);
            else done();
        });
    });
   
    /**
     * @type {Request} 
     * @description Se encarga de revisar si cuando un autor es el emisor de la notificación, el receptor es un editor y el estado
     * del articulo es 3 (Aceptado), se obtiene un error.
     * @returns {JSON} {message: "El articulo ya ha sido aceptado/publicado"}
     * @returns {Number} 500
     */
    it('should return an error', done => {
        const body = {
            id_emisor: 2,
            id_receptor: 1,
            mensaje: "Mensaje de prueba",
            id_articulo_notificacion: 2,
            id_estado: 3,
            new_estado: 2,
            fecha: new Date().toString()
        };
        Request(app)
        .post('/notificaciones')
        .send(body)
        .set("accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(500)
        .expect({message: "El articulo ya ha sido aceptado/publicado"})
        .end((err,res) => {
            if (err) return done(err + " " + res.body.message);
            else done();
        });
    });

    /**
     * @type {Request} 
     * @description Se encarga de revisar si cuando un autor es el emisor de la notificación, el receptor es un editor y el estado
     * del articulo es 5 (Eliminado), se obtiene un error.
     * @returns {JSON} {message: "El articulo ya ha sido eliminado"}
     * @returns {Number} 500
    */
    it('should return an error', done => {
        const body = {
            id_emisor: 2,
            id_receptor: 1,
            mensaje: "Mensaje de prueba",
            id_articulo_notificacion: 2,
            id_estado: 5,
            new_estado: 2,
            fecha: new Date().toString()
        };
        Request(app)
        .post('/notificaciones')
        .send(body)
        .set("accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(500)
        .expect({message: "El articulo ya ha sido eliminado"})
        .end((err,res) => {
            if (err) return done(err + " " + res.body.message);
            else done();
        });
    });

    /**
     * @type {Request}
     * @description Se encarga de revisar si cuando un autor es el emisor de la notificación, el receptor es un editor y el estado
     * del articulo es 6 (Revertido), se obtiene un error.
     * @returns {JSON} {message: "El articulo ha sido revertido, espere revisión"}
     * @returns {Number} 500
    */
    it('should return an error', done => {
        const body = {
            id_emisor: 2,
            id_receptor: 1,
            mensaje: "Mensaje de prueba",
            id_articulo_notificacion: 2,
            id_estado: 6,
            new_estado: 2,
            fecha: new Date().toString()
        };
        Request(app)
        .post('/notificaciones')
        .send(body)
        .set("accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(500)
        .expect({message: "El articulo ha sido revertido, espere revisión"})
        .end((err,res) => {
            if (err) return done(err + " " + res.body.message);
            else done();
        });
    });

    /**
     * @type {Request}
     * @description Se encarga de revisar si cuando un autor es el emisor de la notificación, el receptor es un editor y el estado
     * del articulo es 1 (Añadido), se obtiene el mensaje de exito.
     * @returns {Number} 200
    */
    it('should return ok', done => {
        const body = {
            id_emisor: 2,
            id_receptor: 1,
            mensaje: "Mensaje de prueba",
            id_articulo_notificacion: 2,
            id_estado: 1,
            new_estado: 2,
            fecha: new Date().toString()
        };
        Request(app)
        .post('/notificaciones')
        .send(body)
        .set("accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err,res) => {
            if (err) return done(err + " " + res.body.message);
            else done();
        });
    });

    /**
     * @type {Request}
     * @description Se encarga de revisar si cuando un editor es el emisor de la notificación, el receptor es un autor, el nuevo estado
     * del articulo es 6 (Revertido) y la diferencia de minutos sea mayor a 5, se obtiene un error.
     * @returns {JSON} {message: "No se puede revertir el articulo, ha pasado el tiempo limite"}
     * @returns {Number} 500
    */
    it('should return an error', done => {
        const body = {
            id_emisor: 1,
            id_receptor: 2,
            mensaje: "Mensaje de prueba",
            id_articulo_notificacion: 2,
            id_estado: 2,
            new_estado: 6,
            fecha: "2022-04-01 00:00:00"
        };
        Request(app)
        .post('/notificaciones')
        .send(body)
        .set("accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(500)
        .expect({message: "No se puede revertir el articulo, ha pasado el tiempo limite"})
        .end((err,res) => {
            if (err) return done(err + " " + res.body.message);
            else done();
        });
    });

    /**
     * @type {Request}
     * @description Se encarga de revisar si cuando un editor es el emisor de la notificación, el receptor es un autor, el nuevo estado
     * del articulo es 6 (Revertido) y la diferencia de minutos sea menor a 5, se obtiene el mensaje de exito.
     * @returns {Number} 200
    */
    it('should return ok', done => {
        const body = {
            id_emisor: 1,
            id_receptor: 2,
            mensaje: "Mensaje de prueba",
            id_articulo_notificacion: 2,
            id_estado: 2,
            new_estado: 6,
            fecha: new Date().toString()
        };
        Request(app)
        .post('/notificaciones')
        .send(body)
        .set("accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err,res) => {
            if (err) return done(err + " " + res.body.message);
            else done();
        });
    });

    /**
     * @type {Request}
     * @description Se encarga de revisar si cuando un editor es el emisor de la notificación, el receptor es un autor y el nuevo estado
     * del articulo es 4 (Rechazado), se obtiene el mensaje de exito.
     * @returns {Number} 200
    */
    it('should return ok', done => {
        const body = {
            id_emisor: 1,
            id_receptor: 6,
            mensaje: "Mensaje de prueba",
            id_articulo_notificacion: 6,
            id_estado: 2,
            new_estado: 4,
            fecha: "2022-04-01 00:00:00"
        };
        Request(app)
        .post('/notificaciones')
        .send(body)
        .set("accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err,res) => {
            if (err) return done(err + " " + res.body.message);
            else done();
        });
    });

    /**
     * @type {Request}
     * @description Se encarga de revisar si cuando un editor es el emisor de la notificación, el receptor es un autor y el nuevo estado
     * del articulo es 3 (Aceptado), se obtiene el mensaje de exito.
     * @returns {Number} 200
    */
    it('should return ok', done => {
        const body = {
            id_emisor: 1,
            id_receptor: 8,
            mensaje: "Mensaje de prueba",
            id_articulo_notificacion: 8,
            id_estado: 2,
            new_estado: 3,
            fecha: new Date().toString()
        };
        Request(app)
        .post('/notificaciones')
        .send(body)
        .set("accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err,res) => {
            if (err) return done(err + " " + res.body.message);
            else done();
        });
    });
});
