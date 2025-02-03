import { Entry } from "@prisma/client";
import Prisma from "../src/db";
import { server } from "../src/server";

describe("test valid create", () => {
  it("should create new entry without any errors", async () => {
    const responce = await server.inject({
      method: "POST",
      url: "/create/",
      payload: {
        title: "Test",
        description: "Test",
        created_at: "2025-02-03T00:00:00.000Z",
        scheduled: "2025-02-04T00:00:00.000Z",
      },
    });
    expect(responce.statusCode).toEqual(200);
    expect(responce.json().title).toEqual("Test");
    expect(responce.json().description).toEqual("Test");
    expect(responce.json().created_at).toEqual("2025-02-03T00:00:00.000Z");
    expect(responce.json().scheduled).toEqual("2025-02-04T00:00:00.000Z");
  });
});

describe("test invalid create", () => {
  it("should create an invalid entry and return a 500 error", async () => {
    const responce = await server.inject({
      method: "POST",
      url: "/create/",
      payload: {
        title: "Test",
        description: "Test",
        created_at: "not a date",
        scheduled: "2025-02-04T00:00:00.000z",
      },
    });
    expect(responce.statusCode).toEqual(500);
  });
});

describe("test valid get", () => {
  it("should create new entry and return it with the get method", async () => {
    // Insert new entry
    const responce = await server.inject({
      method: "POST",
      url: "/create/",
      payload: {
        title: "Test2",
        description: "Test2",
        created_at: "2025-02-03T00:00:00.000Z",
        scheduled: "2025-02-04T00:00:00.000Z",
      },
    });
    // Get entry id
    const id = responce.json().id;
    console.log(id);

    // Carry out get method and assert equal
    const get_responce = await server.inject({
      method: "GET",
      url: `/get/${id}`,
    });
    expect(get_responce.statusCode).toEqual(200);
    expect(get_responce.json().title).toEqual("Test2");
    expect(get_responce.json().description).toEqual("Test2");
    expect(get_responce.json().created_at).toEqual("2025-02-03T00:00:00.000Z");
    expect(get_responce.json().scheduled).toEqual("2025-02-04T00:00:00.000Z");
  });
});

describe("test valid update", () => {
  it("should create new entry, update it and get the updated entry", async () => {
    // Insert new entry
    const responce = await server.inject({
      method: "POST",
      url: "/create/",
      payload: {
        title: "Test3",
        description: "Test3",
        created_at: "2025-02-03T00:00:00.000Z",
        scheduled: "2025-02-04T00:00:00.000Z",
      },
    });
    // Get entry id
    const id = responce.json().id;
    console.log(id);

    // Update entry
    const update_responce = await server.inject({
      method: "PUT",
      url: `/update/${id}`,
      payload: {
        title: "Test3update",
        description: "Test3update",
        created_at: "2025-02-03T00:00:00.000Z",
        scheduled: "2025-02-06T00:00:00.000Z",
      },
    });
    expect(update_responce.statusCode).toEqual(200);

    // Carry out get method and assert equal
    const get_responce = await server.inject({
      method: "GET",
      url: `/get/${id}`,
    });
    expect(get_responce.statusCode).toEqual(200);
    expect(get_responce.json().title).toEqual("Test3update");
    expect(get_responce.json().description).toEqual("Test3update");
    expect(get_responce.json().created_at).toEqual("2025-02-03T00:00:00.000Z");
    expect(get_responce.json().scheduled).toEqual("2025-02-06T00:00:00.000Z");
  });
});

describe("test invalid get", () => {
  it("should try to get non-existant entry and return a 500 error", async () => {
    const get_responce = await server.inject({
      method: "GET",
      url: `/get/99999999`,
    });
    expect(get_responce.statusCode).toEqual(500);
  });
});

describe("test invalid update", () => {
  it("should try to update non-existant id and return a 500 error", async () => {
    const update_responce = await server.inject({
      method: "PUT",
      url: `/update/888888`,
      payload: {
        title: "Test5update",
        description: "Test5update",
        created_at: "2025-02-03T00:00:00.000Z",
        scheduled: "2025-02-06T00:00:00.000Z",
      },
    });
    expect(update_responce.statusCode).toEqual(500);
  });
});
