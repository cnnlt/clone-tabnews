test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  const { updated_at } = responseBody;
  const { max_connections, used_connections, postgres_version } =
    responseBody.dependencies.database;

  expect(responseBody).toEqual(
    expect.objectContaining({
      updated_at: expect.any(String),
      dependencies: {
        database: {
          postgres_version: expect.any(Number),
          max_connections: expect.any(Number),
          used_connections: expect.any(Number),
        },
      },
    }),
  );

  expect(responseBody.updated_at).toBeDefined();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(updated_at).toEqual(parsedUpdatedAt);

  expect(postgres_version).toBeDefined();

  expect(max_connections).toBeDefined();

  expect(used_connections).toBeDefined();

  expect(max_connections).toBeGreaterThan(used_connections);
});
