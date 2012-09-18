curl -i -X POST http://localhost:8080/admin/redisSet -F "name=testname" -F "testkey=testvalue"
curl -i -X POST http://localhost:8080/admin/redisGet -F "name=testname"

curl -i -X POST http://localhost:8080/admin/mongoSet -d '{"name":"testname"}'
curl -i -X POST http://localhost:8080/admin/mongoGet -d '{"name":"testname"}'