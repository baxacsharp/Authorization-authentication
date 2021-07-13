import s from "sequelize"
import bcrypt, { hash } from "bcrypt"
const { Sequelize, DataTypes } = s

const { PGUSER, PGPORT, PGDATABASE, PGPASSWORD } = process.env

const sequelize = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, {
  port: PGPORT,
  host: "localhost",
  dialect: "postgres",
})

sequelize
  .authenticate()
  .then(() => {
    console.log("connected")
  })
  .catch((e) => console.log(e))
const Blogs = sequelize.define("blogs", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cover: {
    type: DataTypes.BLOB,
    allowNull: false,
  },

  value: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
})
const Authors = sequelize.define("authors", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.BLOB,
    // allowNull: false,
  },
})

Authors.hashAndSave = async (authorData) => {
  //pre-save stuff
  authorData.password = await bcrypt.hash(authorData.password, 10)
  return await Authors.create(authorData)
}
const Comments = sequelize.define("comments", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  rate: {
    type: DataTypes.INTEGER,
    min: 1,
    max: 5,
    allowNull: false,
  },
})
const category = sequelize.define("category", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
})
// Authors.pre("save", async function (next) {
//   const newAuthor = this
//   const password = newAuthor.password
//   if (newAuthor.isModified("password")) {
//     newAuthor.password = await bcrypt.hash(password, 10)
//   }
//   next()
// })
Authors.checkCredentials = async function (username, password) {
  const author = await Authors.findOne(username)
  if (author) {
    const hashedPassword = author.password
    const isMatched = await bcrypt.compare(hashedPassword, password)
    if (isMatched) {
      return author
    } else {
      return null
    }
  } else {
    return null
  }
}
Authors.hasMany(Blogs)
Blogs.belongsTo(Authors)

Blogs.hasMany(Comments)
Comments.belongsTo(Blogs)

Authors.hasMany(Comments)
Comments.belongsTo(Authors)

Blogs.belongsTo(category)
category.hasMany(Blogs)

export { Blogs, Authors, Comments, category }
export default sequelize
