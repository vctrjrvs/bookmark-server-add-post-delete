  
const BookmarksService = {
     getAllBookmarks(knex) {
       return knex.select('*').from('Bookmarks')
     },
     insertBookmark(knex, newBookmark) {
       return knex
         .insert(newBookmark)
         .into('Bookmarks')
         .returning('*')
         .then(rows => {
           return rows[0]
         })
     },
     getById(knex, id) {
       return knex.from('Bookmarks').select('*').where('id', id).first()
     },
     deleteBookmark(knex, id) {
       return knex('Bookmarks')
         .where({ id })
         .delete()
     },
     updateBookmark(knex, id, newBookmarkFields) {
       return knex('Bookmarks')
         .where({ id })
         .update(newBookmarkFields)
     },
   }
   
   module.exports = BookmarksService