﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Galaxy.Taller.Api.Models
{
    public class OrderProductUpdateDto
    {
        public int OrderProductId { get; set; }
        public int Quantity { get; set; }
    }
}
