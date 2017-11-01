using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ToDoApi.Models;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ToDoApi.Controllers
{
    [Route("api/[controller]")]
    public class ToDoController : Controller
    {
        private readonly ToDoContext _context;

        public ToDoController(ToDoContext context)
        {
            _context = context;

            if (_context.ToDoItems.Count() == 0)
            {
                _context.ToDoItems.Add(new ToDoItem { Name = "ToDo1" });
                _context.ToDoItems.Add(new ToDoItem { Name = "ToDo2" });
                _context.SaveChanges();
            }
        }

        //public async Task<IActionResult> Index()
        //{
        //   return View(await _context.ToDoItems.ToListAsync());
        //}


        // GET: api/values
        [HttpGet]
        public IEnumerable<ToDoItem> GetAll()
        {
            return _context.ToDoItems.ToList();
        }

        // GET api/values/5
        [HttpGet("{id}", Name = "GetToDo")]
        public IActionResult GetById(int id)
        {
            var toDoItem = _context.ToDoItems.FirstOrDefault(x => x.Id == id);

            if (toDoItem == null)
            {
                return NotFound();
            }

            return new ObjectResult(toDoItem);
        }

        // POST api/values
        [HttpPost]
        public IActionResult Create([FromBody]ToDoItem item)
        {

            if (item == null)
            {
                return BadRequest();
            }

            _context.ToDoItems.Add(item);
            _context.SaveChanges();

            return CreatedAtRoute("GetToDo", new {id = item.Id }, item);
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody]ToDoItem item)
        {
            if (item == null || item.Id != id)
            {
                return BadRequest();
            }

            var toDoItem = _context.ToDoItems.FirstOrDefault(x => x.Id == id);

            if (toDoItem == null)
            {
                return NotFound();
            }

            toDoItem.Name = item.Name;
            toDoItem.IsComplete = item.IsComplete;

            _context.ToDoItems.Update(toDoItem);
            _context.SaveChanges();

            return new NoContentResult();
        }

        //[HttpPatch]
        //public IActionResult UpdateField()
        //{
        //    return BadRequest();
        //}

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var toDoItem = _context.ToDoItems.FirstOrDefault(x => x.Id == id);

            if (toDoItem == null)
            {
                return NotFound();
            }

            _context.ToDoItems.Remove(toDoItem);
            _context.SaveChanges();

            return new NoContentResult();
        }
    }
}
