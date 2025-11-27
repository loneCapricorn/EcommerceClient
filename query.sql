-- Seed data for MS SQL Server matching the ECommerceAPI schema
-- Tables: Roles, Users, UserRoles, Categories, Products, ProductCategories, Orders, OrderItems
-- Safe, idempotent inserts: will not duplicate existing rows by Name/Email keys

SET NOCOUNT ON;
SET XACT_ABORT ON;

BEGIN TRAN;

/* Roles */
IF NOT EXISTS (SELECT 1 FROM dbo.Roles WHERE Name = N'Admin')
  INSERT dbo.Roles(Name) VALUES (N'Admin');

IF NOT EXISTS (SELECT 1 FROM dbo.Roles WHERE Name = N'Customer')
  INSERT dbo.Roles(Name) VALUES (N'Customer');

/* Users with SHA256(Base64) password hashes to match PasswordHasher */
DECLARE @pwd NVARCHAR(4000), @hash VARBINARY(32), @hashB64 NVARCHAR(100);

-- Admin user
IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE Email = N'admin@example.com')
BEGIN
  SET @pwd = N'Admin@12345';
  SET @hash = HASHBYTES('SHA2_256', @pwd);
  SET @hashB64 = CAST(N'' AS XML).value('xs:base64Binary(sql:variable("@hash"))', 'NVARCHAR(100)');
  INSERT dbo.Users(Name, Email, PasswordHash)
  VALUES (N'Shop Admin', N'admin@example.com', @hashB64);
END

-- Customer 1
IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE Email = N'john@example.com')
BEGIN
  SET @pwd = N'Customer@123';
  SET @hash = HASHBYTES('SHA2_256', @pwd);
  SET @hashB64 = CAST(N'' AS XML).value('xs:base64Binary(sql:variable("@hash"))', 'NVARCHAR(100)');
  INSERT dbo.Users(Name, Email, PasswordHash)
  VALUES (N'John Doe', N'john@example.com', @hashB64);
END

-- Customer 2
IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE Email = N'jane@example.com')
BEGIN
  SET @pwd = N'Customer@456';
  SET @hash = HASHBYTES('SHA2_256', @pwd);
  SET @hashB64 = CAST(N'' AS XML).value('xs:base64Binary(sql:variable("@hash"))', 'NVARCHAR(100)');
  INSERT dbo.Users(Name, Email, PasswordHash)
  VALUES (N'Jane Smith', N'jane@example.com', @hashB64);
END

/* Assign roles */
DECLARE @roleAdminId INT = (SELECT RoleId FROM dbo.Roles WHERE Name = N'Admin');
DECLARE @roleCustomerId INT = (SELECT RoleId FROM dbo.Roles WHERE Name = N'Customer');
DECLARE @userAdminId INT = (SELECT UserId FROM dbo.Users WHERE Email = N'admin@example.com');
DECLARE @userJohnId INT = (SELECT UserId FROM dbo.Users WHERE Email = N'john@example.com');
DECLARE @userJaneId INT = (SELECT UserId FROM dbo.Users WHERE Email = N'jane@example.com');

IF @userAdminId IS NOT NULL AND @roleAdminId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.UserRoles WHERE UserId=@userAdminId AND RoleId=@roleAdminId)
  INSERT dbo.UserRoles(UserId, RoleId) VALUES (@userAdminId, @roleAdminId);

IF @userJohnId IS NOT NULL AND @roleCustomerId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.UserRoles WHERE UserId=@userJohnId AND RoleId=@roleCustomerId)
  INSERT dbo.UserRoles(UserId, RoleId) VALUES (@userJohnId, @roleCustomerId);

IF @userJaneId IS NOT NULL AND @roleCustomerId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.UserRoles WHERE UserId=@userJaneId AND RoleId=@roleCustomerId)
  INSERT dbo.UserRoles(UserId, RoleId) VALUES (@userJaneId, @roleCustomerId);

/* Categories */
IF NOT EXISTS (SELECT 1 FROM dbo.Categories WHERE Name=N'Electronics') INSERT dbo.Categories(Name) VALUES (N'Electronics');
IF NOT EXISTS (SELECT 1 FROM dbo.Categories WHERE Name=N'Books')       INSERT dbo.Categories(Name) VALUES (N'Books');
IF NOT EXISTS (SELECT 1 FROM dbo.Categories WHERE Name=N'Apparel')     INSERT dbo.Categories(Name) VALUES (N'Apparel');
IF NOT EXISTS (SELECT 1 FROM dbo.Categories WHERE Name=N'Home & Kitchen') INSERT dbo.Categories(Name) VALUES (N'Home & Kitchen');

/* Products */
IF NOT EXISTS (SELECT 1 FROM dbo.Products WHERE Name=N'Wireless Mouse')
  INSERT dbo.Products(Name, Description, Price, Stock)
  VALUES (N'Wireless Mouse', N'Ergonomic 2.4G wireless mouse', 19.99, 200);

IF NOT EXISTS (SELECT 1 FROM dbo.Products WHERE Name=N'Mechanical Keyboard')
  INSERT dbo.Products(Name, Description, Price, Stock)
  VALUES (N'Mechanical Keyboard', N'RGB backlit mechanical keyboard (Blue switches)', 59.99, 120);

IF NOT EXISTS (SELECT 1 FROM dbo.Products WHERE Name=N'Noise Cancelling Headphones')
  INSERT dbo.Products(Name, Description, Price, Stock)
  VALUES (N'Noise Cancelling Headphones', N'Over-ear ANC headphones', 129.99, 80);

IF NOT EXISTS (SELECT 1 FROM dbo.Products WHERE Name=N'Cooking Essentials')
  INSERT dbo.Products(Name, Description, Price, Stock)
  VALUES (N'Cooking Essentials', N'10-piece non-stick cookware set', 89.99, 60);

IF NOT EXISTS (SELECT 1 FROM dbo.Products WHERE Name=N'Cotton T-Shirt')
  INSERT dbo.Products(Name, Description, Price, Stock)
  VALUES (N'Cotton T-Shirt', N'Classic fit 100% cotton t-shirt', 14.99, 300);

IF NOT EXISTS (SELECT 1 FROM dbo.Products WHERE Name=N'Next.js in Action (Book)')
  INSERT dbo.Products(Name, Description, Price, Stock)
  VALUES (N'Next.js in Action (Book)', N'Practical guide to building apps with Next.js', 39.99, 50);

/* ProductCategories (many-to-many) */
DECLARE @catElectronicsId INT = (SELECT CategoryId FROM dbo.Categories WHERE Name=N'Electronics');
DECLARE @catBooksId INT       = (SELECT CategoryId FROM dbo.Categories WHERE Name=N'Books');
DECLARE @catApparelId INT     = (SELECT CategoryId FROM dbo.Categories WHERE Name=N'Apparel');
DECLARE @catHomeId INT        = (SELECT CategoryId FROM dbo.Categories WHERE Name=N'Home & Kitchen');

DECLARE @pMouseId INT   = (SELECT ProductId FROM dbo.Products WHERE Name=N'Wireless Mouse');
DECLARE @pKbdId INT     = (SELECT ProductId FROM dbo.Products WHERE Name=N'Mechanical Keyboard');
DECLARE @pHeadId INT    = (SELECT ProductId FROM dbo.Products WHERE Name=N'Noise Cancelling Headphones');
DECLARE @pCookId INT    = (SELECT ProductId FROM dbo.Products WHERE Name=N'Cooking Essentials');
DECLARE @pShirtId INT   = (SELECT ProductId FROM dbo.Products WHERE Name=N'Cotton T-Shirt');
DECLARE @pBookId INT    = (SELECT ProductId FROM dbo.Products WHERE Name=N'Next.js in Action (Book)');

IF @pMouseId IS NOT NULL AND @catElectronicsId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.ProductCategories WHERE ProductId=@pMouseId AND CategoryId=@catElectronicsId)
  INSERT dbo.ProductCategories(ProductId, CategoryId) VALUES (@pMouseId, @catElectronicsId);

IF @pKbdId IS NOT NULL AND @catElectronicsId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.ProductCategories WHERE ProductId=@pKbdId AND CategoryId=@catElectronicsId)
  INSERT dbo.ProductCategories(ProductId, CategoryId) VALUES (@pKbdId, @catElectronicsId);

IF @pHeadId IS NOT NULL AND @catElectronicsId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.ProductCategories WHERE ProductId=@pHeadId AND CategoryId=@catElectronicsId)
  INSERT dbo.ProductCategories(ProductId, CategoryId) VALUES (@pHeadId, @catElectronicsId);

IF @pCookId IS NOT NULL AND @catHomeId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.ProductCategories WHERE ProductId=@pCookId AND CategoryId=@catHomeId)
  INSERT dbo.ProductCategories(ProductId, CategoryId) VALUES (@pCookId, @catHomeId);

IF @pShirtId IS NOT NULL AND @catApparelId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.ProductCategories WHERE ProductId=@pShirtId AND CategoryId=@catApparelId)
  INSERT dbo.ProductCategories(ProductId, CategoryId) VALUES (@pShirtId, @catApparelId);

IF @pBookId IS NOT NULL AND @catBooksId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.ProductCategories WHERE ProductId=@pBookId AND CategoryId=@catBooksId)
  INSERT dbo.ProductCategories(ProductId, CategoryId) VALUES (@pBookId, @catBooksId);

/* Sample Order for john@example.com */
IF @userJohnId IS NOT NULL
BEGIN
  DECLARE @orderId INT;
  DECLARE @q1 INT = 2, @q2 INT = 1;

  DECLARE @priceMouse DECIMAL(18,2) = (SELECT Price FROM dbo.Products WHERE ProductId=@pMouseId);
  DECLARE @priceKbd   DECIMAL(18,2) = (SELECT Price FROM dbo.Products WHERE ProductId=@pKbdId);

  -- Only create the order if none exists yet for the user today (idempotent-ish)
  IF NOT EXISTS (
    SELECT 1 FROM dbo.Orders
    WHERE UserId = @userJohnId
      AND CAST(OrderDate AS DATE) = CAST(SYSUTCDATETIME() AS DATE)
  )
  BEGIN
    INSERT dbo.Orders(UserId, OrderDate, TotalAmount)
    VALUES (@userJohnId, SYSUTCDATETIME(), 0);
    SET @orderId = SCOPE_IDENTITY();

    IF @pMouseId IS NOT NULL
      INSERT dbo.OrderItems(OrderId, ProductId, Quantity, UnitPrice)
      VALUES (@orderId, @pMouseId, @q1, @priceMouse);

    IF @pKbdId IS NOT NULL
      INSERT dbo.OrderItems(OrderId, ProductId, Quantity, UnitPrice)
      VALUES (@orderId, @pKbdId, @q2, @priceKbd);

    UPDATE o
      SET TotalAmount = x.SumTotal
    FROM dbo.Orders o
    CROSS APPLY (
      SELECT SUM(oi.Quantity * oi.UnitPrice) AS SumTotal
      FROM dbo.OrderItems oi
      WHERE oi.OrderId = o.OrderId
    ) x
    WHERE o.OrderId = @orderId;
  END
END

COMMIT TRAN;

-- Quick sanity checks (optional):
-- SELECT TOP 5 * FROM dbo.Users;
-- SELECT TOP 5 * FROM dbo.Products;
-- SELECT * FROM dbo.Orders ORDER BY OrderId DESC;
