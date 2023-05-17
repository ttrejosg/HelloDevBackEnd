import request from "supertest"
import app from "../src/app.js";

/**
 * Testing articles creation post route.
 */
describe("/POST /articulos", () => {
  const portada = "./test/files/test.jpg";
  const archivo = "./test/files/test.pdf";

   it("Respond whit a 500 status and a json containing the error message = falta titulo y resumen",(done) => {
    const expectedMessage = `{"message":"Falta titulo y resumen"}`;
    request(app)
      .post("/articulos")
      .field("titulo", "")
      .field("resumen", "")
      .field("id_autor", 1)
      .attach("portada", portada)
      .attach("archivo", archivo)
      .set("Content-Type","multipart/form-data")
      .expect(500)
      .expect(expectedMessage,done);
  });

  it("Respond whit a 500 status and a json containing the error message = falta titulo",(done) => {
    const expectedMessage = `{"message":"Falta titulo"}`;
    request(app)
      .post("/articulos")
      .field("titulo", "")
      .field("resumen", "Estos son códigos que estan rotundamente prohibidos")
      .field("id_autor", 1)
      .attach("portada", portada)
      .attach("archivo", archivo)
      .set("Content-Type","multipart/form-data")
      .expect(500)
      .expect(expectedMessage,done);
  });

  it("Respond whit a 500 status and a json containing the error message = falta titulo",(done) => {
    const expectedMessage = `{"message":"Falta titulo"}`;
    request(app)
      .post("/articulos")
      .field("titulo", "")
      .field("resumen", "Estos son códigos que estan rotundamente prohibidos")
      .field("id_autor", 1)
      .attach("portada", null)
      .attach("archivo", null)
      .set("Content-Type","multipart/form-data")
      .expect(500)
      .expect(expectedMessage,done);
  });

  it("Respond whit a 500 status and a json containing the error message = falta titulo",(done) => {
    const expectedMessage = `{"message":"Falta titulo"}`;
    request(app)
      .post("/articulos")
      .field("titulo", "")
      .field("resumen", "Estos son códigos que estan rotundamente prohibidos")
      .field("id_autor", 1)
      .attach("portada", null)
      .attach("archivo", archivo)
      .set("Content-Type","multipart/form-data")
      .expect(500)
      .expect(expectedMessage,done);
  });

  it("Respond whit a 500 status and a json containing the error message = falta resumen",(done) => {
    const expectedMessage = `{"message":"Falta resumen"}`;
    request(app)
      .post("/articulos")
      .field("titulo", "Los códigos prohibidos")
      .field("resumen", "")
      .field("id_autor", 1)
      .attach("portada", portada)
      .attach("archivo", archivo)
      .expect(500)
      .expect(expectedMessage,done);
  });

  it("Respond whit a 500 status and a json containing the error message = falta archivo y portada",(done) => {
    const expectedMessage = `{"message":"Falta archivo y portada"}`;
    request(app)
      .post("/articulos")
      .field("titulo", "Los códigos prohibidos")
      .field("resumen", "Estos son códigos que estan rotundamente prohibidos")
      .field("id_autor", 1)
      .attach("portada", null)
      .attach("archivo", null)
      .set("Content-Type","multipart/form-data")
      .expect(500)
      .expect(expectedMessage,done);
  });

  it("Respond with a 500 status and a json containing the error message = falta archivo",(done) => {
    const expectedMessage = `{"message":"Falta archivo"}`;
    request(app)
      .post("/articulos")
      .field("titulo", "Los códigos prohibidos")
      .field("resumen", "Estos son códigos que estan rotundamente prohibidos")
      .field("id_autor", 1)
      .attach("portada", portada)
      .attach("archivo", null)
      .set("Content-Type","multipart/form-data")
      .expect(500)
      .expect(expectedMessage,done);
  });

  it("Respond with a 500 status and a json containing the error message = falta portada",(done) => {
    const expectedMessage = `{"message":"Falta portada"}`;
    request(app)
      .post("/articulos")
      .field("titulo", "Los códigos prohibidos")
      .field("resumen", "Estos son códigos que estan rotundamente prohibidos")
      .field("id_autor", 1)
      .attach("portada", null)
      .attach("archivo", archivo)
      .set("Content-Type","multipart/form-data")
      .expect(500)
      .expect(expectedMessage,done);
  });

  it("Respond with a 500 status when there is no affected rows in the data base and a json containing the error message = no se pudo insertar el articulo",(done) => {
    const expectedMessage = `{"message":"No se pudo insertar el articulo"}`;
    request(app)
      .post("/articulos")
      .field("titulo", `Los códigos prohibidos" OR 1=1 #`)
      .field("resumen", "Estos son códigos que estan rotundamente prohibidos")
      .field("id_autor", 1)
      .attach("portada", portada)
      .attach("archivo", archivo)
      .set("Content-Type","multipart/form-data")
      .expect(500)
      .expect(expectedMessage,done);
  });

 it("respond with json containing the id of the inserted article",(done) => {
    const expectedId = `{"id":16}`;
    request(app)
      .post("/articulos")
      .field("titulo", "Los códigos prohibidos")
      .field("resumen", "Estos son códigos que estan rotundamente prohibidos")
      .field("id_autor", 1)
      .attach("portada", portada)
      .attach("archivo", archivo)
      .set("Content-Type","multipart/form-data")
      .expect(expectedId,done);
  });

});
  
