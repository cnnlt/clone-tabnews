import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const databaseInfo = {};
  try {
    databaseInfo.postgres_version = parseFloat(
      (await database.query("SHOW server_version;")).rows[0].server_version,
    );
    databaseInfo.max_connections = parseInt(
      (await database.query("SHOW max_connections;")).rows[0][
        "max_connections"
      ],
    );
    databaseInfo.used_connections = parseInt(
      (await database.query("SELECT COUNT(*) FROM pg_stat_activity;")).rows[0][
        "count"
      ],
    );
  } catch (error) {
    databaseInfo.error = "Cannot connect with database";
  } finally {
    response.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          ...databaseInfo,
        },
      },
    });
  }
}

export default status;
