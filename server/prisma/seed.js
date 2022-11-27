const { PrismaClient, Role } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')

async function main() {
  const admin = await prisma.user.upsert({
    where: { 
        email: 'johnAdmin@test.com' 
    },
    update: {},
    create: {
        email: 'johnAdmin@test.com',
        name: 'john',
        password: bcrypt.hashSync("123", 10),
        role: Role.Admin
    },
  })

  const user = await prisma.user.upsert({
    where: { 
        email: 'doeUser@test.com' 
    },
    update: {},
    create: {
        email: 'doeUser@test.com',
        name: 'doe',
        password: bcrypt.hashSync("123", 10)
    },
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })