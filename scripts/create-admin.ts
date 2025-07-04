import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@trawers.pl'
  const password = 'admin123'

  // Sprawdź czy admin już istnieje
  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  })

  if (existingAdmin) {
    console.log('Administrator już istnieje')
    return
  }

  // Utwórz nowego admina
  const hashedPassword = await bcrypt.hash(password, 10)
  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: 'Administrator',
      role: 'ADMIN',
    },
  })

  console.log('Administrator został utworzony:', admin)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 