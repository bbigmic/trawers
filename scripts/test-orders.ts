import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testOrders() {
  try {
    console.log('🔍 Sprawdzanie kursów w bazie danych...')
    
    // Sprawdź kursy
    const courses = await prisma.course.findMany()
    console.log(`📚 Znaleziono ${courses.length} kursów:`)
    courses.forEach(course => {
      console.log(`  - ${course.title} (ID: ${course.id}) - ${course.price} zł`)
    })

    if (courses.length === 0) {
      console.log('❌ Brak kursów w bazie danych!')
      return
    }

    console.log('\n👥 Sprawdzanie użytkowników...')
    
    // Sprawdź użytkowników
    const users = await prisma.user.findMany()
    console.log(`👤 Znaleziono ${users.length} użytkowników:`)
    users.forEach(user => {
      console.log(`  - ${user.email} (ID: ${user.id}) - Rola: ${user.role}`)
    })

    if (users.length === 0) {
      console.log('❌ Brak użytkowników w bazie danych!')
      return
    }

    console.log('\n📦 Sprawdzanie zamówień...')
    
    // Sprawdź zamówienia
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            email: true
          }
        },
        course: {
          select: {
            title: true
          }
        }
      }
    })
    
    console.log(`🛒 Znaleziono ${orders.length} zamówień:`)
    orders.forEach(order => {
      console.log(`  - ID: ${order.id}`)
      console.log(`    Użytkownik: ${order.user.email}`)
      console.log(`    Kurs: ${order.course.title}`)
      console.log(`    Status: ${order.status}`)
      console.log(`    Kwota: ${order.amount} zł`)
      console.log(`    Data: ${order.createdAt}`)
      console.log('')
    })

    // Utwórz testowe zamówienie jeśli nie ma żadnych
    if (orders.length === 0) {
      console.log('➕ Tworzenie testowego zamówienia...')
      
      const testUser = users[0]
      const testCourse = courses[0]
      
      const testOrder = await prisma.order.create({
        data: {
          userId: testUser.id,
          courseId: testCourse.id,
          status: 'COMPLETED',
          amount: testCourse.price,
          paymentId: 'test-payment-' + Date.now(),
        },
        include: {
          user: {
            select: {
              email: true
            }
          },
          course: {
            select: {
              title: true
            }
          }
        }
      })
      
      console.log('✅ Utworzono testowe zamówienie:')
      console.log(`  - ID: ${testOrder.id}`)
      console.log(`  - Użytkownik: ${testOrder.user.email}`)
      console.log(`  - Kurs: ${testOrder.course.title}`)
      console.log(`  - Status: ${testOrder.status}`)
      console.log(`  - Kwota: ${testOrder.amount} zł`)
    }

  } catch (error) {
    console.error('❌ Błąd podczas testowania:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testOrders() 