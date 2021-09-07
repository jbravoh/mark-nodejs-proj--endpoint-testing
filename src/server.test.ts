import supertest from "supertest";
import app from "./server";
import { MYSTERIOUS_ROBED_FIGURE } from "./constants/characters";
import { CAVE_EXTERIOR } from "./constants/locations";

test("GET / responds with a welcome message from our mysterious robed figure", async () => {
  const response = await supertest(app).get("/");

  expect(response.body).toStrictEqual({
    location: CAVE_EXTERIOR,
    speech: {
      speaker: MYSTERIOUS_ROBED_FIGURE,
      text:
        "Welcome, young adventurer, to the ENDPOINT ADVENTURE. Are you ready for this quest?",
    },
    options: {
      yes: "/quest/accept",
      no: "/quest/decline",
      help: "/help",
    },
  });
});

test("GET /quest/accept has our mysterious robed figure give a couple of further choices", async () => {
  const response = await supertest(app).get("/quest/accept");

  // check the speaker and location are right
  expect(response.body).toMatchObject({
    location: CAVE_EXTERIOR,
    speech: {
      speaker: MYSTERIOUS_ROBED_FIGURE,
    },
  });

  // check the robed figure is saying something
  expect(typeof response.body.speech.text).toBe("string");

  // check that there are at least two further options
  expect(Object.keys(response.body.options).length).toBeGreaterThanOrEqual(2);
});

test("GET /quest/decline responds with an apocalyptic message", async () => {
  const response = await supertest(app).get("/quest/decline");

  // located in the apocalypse
  expect(response.body.location).toBe("Apocalypse");

  // aggro speaker
  expect(response.body.speech.speaker.name).toBe("Titan, Destroyer of Worlds");

  // some aggro message
  expect(response.body.speech.text).toMatch("FOOL");
  expect(response.body.speech.text).toMatch(/mistake/i);

  // only includes the option to restart
  expect(response.body.options).toStrictEqual({ restart: "/" });
});

test("GET /quest/start/impossible responds with instant 'death'", async () => {
  const response = await supertest(app).get("/quest/start/impossible");

  // there is _some_ location
  expect(response.body.location).toBeDefined();

  // there is _some_ speaker
  expect(response.body.speech.speaker.name).toBeDefined();

  // fiery death
  expect(response.body.speech.text).toMatch(/fireball/i);
  expect(response.body.speech.text).toMatch(/dragon/i);
  expect(response.body.speech.text).toMatch(/excruciating/i);

  // includes option to restart
  expect(response.body.options).toMatchObject({ restart: "/" });
});


test("GET /quest/help has a message from the advernture admin ", async () => {
  const response = await supertest(app).get("/help");
  
  expect(response.body.location).toBeDefined();
  expect(response.body.speech.speaker.name).toBeDefined();
  expect(response.body.speech.text).toMatch(/endpoint/i);
  expect(response.body.speech.text).toMatch(/adventure/i);
  expect(response.body.options).toMatchObject({ backToStart: "/" });
})


test("GET /quest/start/easy has a message from the advernture admin ", async () => {
  const response = await supertest(app).get("/quest/start/easy");
  
  expect(response.body.location).toBeDefined();
  expect(response.body.speech.speaker.name).toBeDefined();
  expect(response.body.speech.text).toMatch(/complete/i);
  expect(response.body.speech.text).toMatch(/smart/i);
  expect(response.body.options).toMatchObject({ beginQuest: "/quest/start/easy/first-task" });
})


test("GET /quest/start/hard has a message from the advernture admin ", async () => {
  const response = await supertest(app).get("/quest/start/hard");
  
  expect(response.body.location).toBeDefined();
  expect(response.body.speech.speaker.name).toBeDefined();
  expect(response.body.speech.text).toMatch(/tested/i);
  expect(response.body.speech.text).toMatch(/tasks/i);
  expect(response.body.options).toMatchObject({ beginQuest: "/quest/start/hard/first-task" });
})

// Exericse 5

test("GET /quest/start/easy/first-task has a message from the advernture admin ", async () => {
  const response = await supertest(app).get("/quest/start/easy/first-task");
  
  expect(response.body.location).toBeDefined();
  expect(response.body.speech.speaker.name).toBeDefined();
  expect(response.body.speech.text).toMatch(/remove/i);
  expect(response.body.speech.text).toMatch(/phone/i);
  expect(response.body.options).toMatchObject({ taskComplete: "/quest/start/easy/second-task",
  taskFailed: "/quest/failed-task-one" });
})

test("GET /quest/start/hard/first-task has a message from the advernture admin ", async () => {
  const response = await supertest(app).get("/quest/start/hard/first-task");
  
  expect(response.body.location).toBeDefined();
  expect(response.body.speech.speaker.name).toBeDefined();
  expect(response.body.speech.text).toMatch(/distractions/i);
  expect(response.body.speech.text).toMatch(/social/i);
  expect(response.body.options).toMatchObject({ taskComplete: "/quest/start/hard/second-task",
  taskFailed: "/quest/failed-task-one" });
})

test("GET /quest/failed-task-one has a message from the advernture admin ", async () => {
  const response = await supertest(app).get("/quest/failed-task-one");
  
  expect(response.body.location).toBeDefined();
  expect(response.body.speech.speaker.name).toBeDefined();
  expect(response.body.speech.text).toMatch(/complete/i);
  expect(response.body.speech.text).toMatch(/death/i);
  expect(response.body.options).toMatchObject({ restart: "/" });
})