using Microsoft.EntityFrameworkCore;
using MyShop.Models;

namespace MyShop.DAL;

public class ItemDbContext : DbContext
{
    public ItemDbContext(DbContextOptions<ItemDbContext> options) : base(options)
    {
    }

    public DbSet<Item> Items { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    // Removed OnConfiguring with UseLazyLoadingProxies()
}