'use client';

import AccButton from '@/app/_components/Generator/AccButton';
import AccTable from '@/app/_components/Generator/AccTable';
import { AccAlert } from '@/app/_lib/Generator/AccAlert';
import { fetcher } from '@/app/_lib/Handling/Fetcher';
import { faBan, faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, CardBody, Chip, Switch } from '@nextui-org/react';
import { Session } from 'next-auth';
import React, { useState } from 'react';
import useSWR from 'swr';

export default function EmployeesDashboard({ session }: { session: Session | null }) {
  const sessionId = session?.user.id ?? '';
  const [showNonActiveEmp, setShowNonActiveEmp] = useState(false);
  const { data, mutate } = useSWR(`/api/companies/employees?id=${sessionId}&isactive=${showNonActiveEmp}`, fetcher);

  const deleteAction = async (id: string) => {
    const res = await fetch(`/api/companies/employees/${id}?id=${sessionId}`, {
      method: 'DELETE',
    });

    const result = await res.json();
    if (!res.ok && res.status !== 200) {
      return AccAlert.fire({
        title: result?.message,
        icon: 'error',
      });
    }

    return AccAlert.fire({
      title: result?.message,
      icon: 'success',
    }).then(() => mutate(data));
  };

  const activeAction = async (id: string) => {
    const res = await fetch(`/api/companies/employees/${id}`, {
      method: 'POST',
      body: JSON.stringify({
        id: sessionId,
      }),
    });

    const result = await res.json();
    if (!res.ok && res.status !== 200) {
      return AccAlert.fire({
        title: result?.message,
        icon: 'error',
      });
    }

    return AccAlert.fire({
      title: result?.message,
      icon: 'success',
    }).then(() => mutate(data));
  };

  const showActiveWarning = (id: string) => {
    AccAlert.fire({
      title: 'Are you sure?',
      icon: 'question',
      html: (
        <span className="text-sm text-black/60">
          This action make your Employee <span className="text-success">can login to your bussiness</span>
        </span>
      ),
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) return activeAction(id);

      return;
    });
  };

  const showDeleteWarning = (id: string) => {
    AccAlert.fire({
      title: 'Are you sure?',
      icon: 'question',
      html: (
        <span className="text-sm text-black/60">
          You can't <span className="text-danger">delete permanently</span>. But it will make your Employee <span className="text-danger">can't login permanently.</span>
        </span>
      ),
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) return deleteAction(id);

      return;
    });
  };

  const actionButtons = (isActive: boolean, id: string) => {
    if (!isActive)
      return (
        <Button color={'success'} size={'sm'} onClick={() => showActiveWarning(id)} className="text-white" startContent={<FontAwesomeIcon icon={faCheck} />}>
          Active
        </Button>
      );

    return (
      <Button color={'danger'} onClick={() => showDeleteWarning(id)} size={'sm'} startContent={<FontAwesomeIcon icon={faBan} />}>
        Deactive
      </Button>
    );
  };
  const status = (isActive: boolean) => {
    if (!isActive)
      return (
        <Chip color={'danger'} variant={'flat'} size={'sm'}>
          Non-Active
        </Chip>
      );

    return (
      <Chip color={'success'} variant={'flat'} size={'sm'}>
        Active
      </Chip>
    );
  };
  const employeeData = data?.employees.map((emp: any, i: number) => {
    return {
      key: i + 1,
      no: i + 1,
      employee_code: emp.employee_code,
      name: emp.name,
      status: status(emp.is_active),
      action: actionButtons(emp.is_active, emp.id),
    };
  });
  return (
    <Card>
      <CardBody>
        <section className="p-1">
          <div className="flex justify-between">
            <h1 className="text-xl font-semibold">Employees</h1>
            <AccButton href="/companies/dashboard/employees/add" icon={faPlus} color={'primary'}>
              Add Employees
            </AccButton>
          </div>
          <AccTable
            isSearchable
            extraContent={
              <div className="flex items-center gap-3">
                <Switch aria-label="Show Non Active Employee Only" size={'sm'} isSelected={showNonActiveEmp} onValueChange={(val) => setShowNonActiveEmp(val)}>
                  Show Non-Active Employee Only
                </Switch>
              </div>
            }
            searchFilterColumn={['Name', 'Employee Code']}
            isLoading={!data}
            columns={['Employee Code', 'Name', 'Status', 'Action']}
            data={employeeData}
          />
        </section>
      </CardBody>
    </Card>
  );
}
