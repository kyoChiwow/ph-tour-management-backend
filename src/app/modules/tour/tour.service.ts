import { QueryBuilder } from "../../utils/QueryBuilder";
import { tourSearchableFields } from "./tour.constant";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

const createTour = async (payload: ITour) => {
  const existingTour = await Tour.findOne({ title: payload.title });
  if (existingTour) {
    throw new Error("Tour already exist!");
  }

  const tour = await Tour.create(payload);
  return tour;
};

// const getAllTours = async (query: Record<string, string>) => {
//     const filter = query;
//     const searchTerm = query.searchTerm || "";
//     const sort = query.sort || "-createdAt";
//     const fields = query.fields?.split(",").join(" ") || "";
//     const page = Number(query.page || 1);
//     const limit = Number(query.limit || 10);
//     const skip = (page - 1) * limit;

//     for(const field in excludefield) {
//         // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//         delete filter[field];
//     }

//     const searchQuery = {
//         $or: tourSearchableFields.map(field => ({ [field]: { $regex: searchTerm, $options: "i" } }))
//     }

//     const filterQuery = Tour.find(filter)
//     const tours = filterQuery.find(searchQuery)
//     const allTours = await tours.sort(sort).select(fields).limit(limit).skip(skip);
//     // const tours = await Tour.find(searchObject).find(filter).sort(sort).select(fields).limit(limit).skip(skip);
//     const totalTours = await Tour.countDocuments();

//     const meta = {
//         page: page,
//         total: totalTours,
//         limit: limit,
//         totalPages: Math.ceil(totalTours / limit)
//     }
//     return {
//         data: allTours,
//         meta: meta
//     }
// }

const getAllTours = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Tour.find(), query);

  const tours = await queryBuilder
    .search(tourSearchableFields)
    .filter()
    .fields()
    .sort()
    .paginate()

  //   const meta = await queryBuilder.getMeta();
  const [data, meta] = await Promise.all([
    tours.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const updateTour = async (id: string, payload: Partial<ITour>) => {
  const existingTour = await Tour.findById(id);

  if (!existingTour) {
    throw new Error("Tour not found.");
  }

  const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true });

  return updatedTour;
};

const deleteTour = async (id: string) => {
  return await Tour.findByIdAndDelete(id);
};

const createTourType = async (payload: ITourType) => {
  const existingTourType = await TourType.findOne({ name: payload.name });

  if (existingTourType) {
    throw new Error("Tour type already exists.");
  }

  return await TourType.create({ name });
};
const getAllTourTypes = async () => {
  return await TourType.find();
};
const updateTourType = async (id: string, payload: ITourType) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new Error("Tour type not found.");
  }

  const updatedTourType = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updatedTourType;
};
const deleteTourType = async (id: string) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new Error("Tour type not found.");
  }

  return await TourType.findByIdAndDelete(id);
};

export const TourService = {
  createTour,
  getAllTours,
  updateTour,
  deleteTour,
  createTourType,
  getAllTourTypes,
  updateTourType,
  deleteTourType,
};
