import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function main() {
    // get modules based on companyId
    // const companyModules = await prisma.module.findMany({
    //     include: {
    //         other_module: {
    //             include: {
    //                 other_module: true,
    //             },
    //         },
    //     },
    //     where: {
    //         moduleParentId: null, // validacion innecesaria ya que le asignacion de modules con categories es solo hacia los modulos padre
    //         category: {
    //             company_category: {
    //                 some: {
    //                     companyId: 1
    //                 }
    //             }
    //         }
    //     }
    // })
    // console.log(companyModules)
    // get modules based on roleId
    const modules = await prisma.module.findMany({
        include: {
            other_module: {
                where: {
                    module_function: {
                        some: {
                            modulefunction_role: {
                                some: {
                                    roleId: 1
                                }
                            }
                        }
                    }
                },
                include: {
                    other_module: {
                        where: {
                            module_function: {
                                some: {
                                    modulefunction_role: {
                                        some: {
                                            roleId: 1
                                        }
                                    }
                                }
                            }
                        },
                    }
                }
            },
        },
        where: {
            moduleParentId: null,
            module_function: {
                some: {
                    modulefunction_role: {
                        some: {
                            roleId: 1
                        }
                    }
                }
            }
        }
    })
    console.log(modules)
    // console.log(modules[2].other_module[0].other_module)
    // const recursion = await prisma.$queryRaw`WITH RECURSIVE ModulosRecursivos AS (
    //     SELECT
    //       m.*,
    //       1 as lvl
    //     FROM
    //       module m
    //     WHERE
    //       m.moduleParentId IS NULL -- Módulos principales
    //     UNION ALL
    //     SELECT
    //       m.*,
    //       mr.lvl + 1
    //     FROM
    //       module m
    //     JOIN
    //       ModulosRecursivos mr ON mr.moduleId = m.moduleParentId
    //   )
    //   SELECT
    //     lvl1.*,
    //     json_arrayagg(
    //       JSON_OBJECT(
    //         'moduleId', lvl2.moduleId,
    //         'moduleName', lvl2.moduleName,
    //         'other_modules', (
    //           SELECT json_arrayagg(
    //             JSON_OBJECT('moduleId', lvl3.moduleId, 'moduleName', lvl3.moduleName)
    //           )
    //           FROM ModulosRecursivos lvl3
    //           WHERE lvl3.lvl = lvl2.lvl + 1 AND lvl3.moduleParentId = lvl2.moduleId
    //         )
    //       )
    //     ) AS other_modules
    //   FROM
    //     (SELECT * FROM ModulosRecursivos mr WHERE lvl = 1) lvl1
    //   LEFT JOIN (SELECT * FROM ModulosRecursivos mr WHERE lvl = 2) lvl2 ON lvl1.moduleId = lvl2.moduleParentId
    //   GROUP BY lvl1.moduleId, lvl1.moduleName, lvl1.moduleParentId, lvl1.categoryId, lvl1.lvl`;
    // console.log(recursion)
}

main()